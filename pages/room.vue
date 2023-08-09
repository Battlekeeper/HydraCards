<script setup lang="ts">
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import voteCard from "../components/voteCard.vue";
import roomMemberDisplayItem from "../components/roomMemberDisplayItem.vue";
import { HCRoomStatus } from "../backend/models/HCRoomStatus";
import { HCVotingStatus } from "../backend/models/HCVotingStatus";
import voteResultNameDisplay from "../components/voteResultNameDisplay.vue";
import { TSMap } from "typescript-map"
import topicHistoryItem from "../components/topicHistoryItem.vue";
import qrCode from "../components/qrCode.vue";

//@ts-ignore
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Title } from 'chart.js'
//@ts-ignore
import { Pie, Bar, Doughnut } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const pieData = ref({
	labels: [''],
	datasets: [
		{
			label: '',
			backgroundColor: ['#CF551B', '#E46651', '#F16523', '#EEA684'],
			data: [1]
		}
	]
})

const chartOptions = {
	responsive: false,
	maintainAspectRatio: false
}


const config = useRuntimeConfig()
const route = useRouter()
const colormode = useColorMode()

const showStoryPointsPrompt = ref(false)
const selectedChart = ref("pie")
var socket = io()
const displayName = ref("")
const roomTopicName = ref("")
const countDownTime = ref()
const selectedCard = ref()
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const currentRoomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)
const userId: Ref<string> = ref(useCookie('_id').value as string)
var roomId: string = route.currentRoute.value.query.id as string
const sortedVotes = ref()
const showQRCodeModal = ref(false)
const minutes = ref(0)
const seconds = ref(0)
const allowAnonymousMode = ref(true)

const { data: room } = await useFetch(`api/room/getRoomById?id=` + roomId, { baseURL: config.public.baseUrl })
currentRoom.value = room.value as HCRoom

var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
pieData.value.labels = votes.keys()
pieData.value.datasets[0].data = votes.values()


const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.baseUrl })
currentUser.value = user.value as HCUser


async function apiJoinRoom() {
	var response = await useFetch(`api/room/joinRoom?id=` + roomId, { credentials: "include", baseURL: config.public.baseUrl })

	// @ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function socketLeaveRoom() {
	// @ts-ignore
	socket.emit("leaveRoom", room.value?.id as Number, userId.value as string)
	window.location.href = "/"
}
function socketDisplayResults() {
	socket.emit("displayResults", Number.parseInt(roomId), userId.value)
}
function socketRevote() {
	socket.emit("revote", currentRoom.value.id, userId.value, true)
}
function socketNewTopic(points:number) {
	socket.emit("revote", currentRoom.value.id, userId.value, false, points)
	roomTopicName.value = ""
	socket.emit("setRoomTopicName", currentRoom.value.id, currentUser.value.id, "")
	showStoryPointsPrompt.value = false
}
function isInRoom() {
	const roomExists = currentRoom.value != undefined
	const userExists = currentUser.value != undefined
	const userInRoom = currentRoom.value?.members.findIndex((id) => userId.value == id) != -1
	if (roomExists && userExists && userInRoom) {
		return true
	}
	return false
}
async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, { credentials: "include", baseURL: config.public.baseUrl })
}
function socketSetName() {
	socket.emit("setMemberName", currentRoom.value.id, currentUser.value.id, displayName.value)
}
function submitVote(vote: string, event:any) {
	var element = event.target

	if (element.localName == 'p'){
		element = element.parentElement
	}

	if (selectedCard.value != undefined){
		selectedCard.value.classList.replace("bg-blue-800","bg-gray-300")
		selectedCard.value.classList.replace("dark:bg-orange-500","dark:bg-gray-700")
	}

	socket.emit("submitVote", Number.parseInt(roomId), userId.value, vote)
	element.classList.replace("bg-gray-300","bg-blue-800")
	element.classList.replace("dark:bg-gray-700", "dark:bg-orange-500")
	selectedCard.value = element

}
function getRoomVotesMap(room: HCRoom) {
	var votes: TSMap<string, number> = new TSMap<string, number>

	if (!room) {
		return votes
	}
	Object.values(room.votes).forEach((vote: number) => {

		var curr: number = votes.get(vote.toString())
		if (curr == undefined) {
			curr = 0
		}
		votes.set(vote.toString(), curr + 1)
	})
	votes.delete("-1")
	return votes
}
function socketSetTopicName() {
	socket.emit("setRoomTopicName", currentRoom.value.id, currentUser.value.id, roomTopicName.value)
}
function socketStartCount() {
	socket.emit("startCount", currentRoom.value.id, currentUser.value.id, minutes.value * 60 + seconds.value)
}
function downloadBase64File(contentBase64: string, fileName: string) {
	const linkSource = contentBase64;
	const downloadLink = document.createElement('a');
	document.body.appendChild(downloadLink);

	downloadLink.href = linkSource;
	downloadLink.target = '_self';
	downloadLink.download = fileName;
	downloadLink.click();
}
function downloadCharts() {
	downloadBase64File(ChartJS.instances[0].toBase64Image(), "pie.png")
	downloadBase64File(ChartJS.instances[1].toBase64Image(), "bar.png")
}
async function downloadTopicCSV(topicIndex: number, topicName: string) {
	var response = await useFetch(`api/room/csv`, { baseURL: config.public.baseUrl, query: { id: currentRoom.value.id, topic: topicIndex } })
	const blob = new Blob([response.data.value as any], { type: 'text/csv' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = topicName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
function copy() {
	navigator.clipboard.writeText(window.location.href)
}
function socketSetCoffeeBreak(enabled:boolean){
	socket.emit("coffeebreak", currentRoom.value.id, currentUser.value.id, enabled)
}
function mounted(){
	socket = io(config.public.baseUrl.replace("http", "ws").replace("https", "wss"))
	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`);
	});
	socket.on("connect", () => {
		socket.emit("joinSocketRoom", Number.parseInt(roomId), userId.value as string)
		socket.emit("setSocketId", currentUser.value.id)
		setInterval(() => { 
			socket.emit("onlinePing", currentUser.value.id, document.hasFocus()) 
	}, 1000)
	})
	socket.on("roomStateUpdate", (room: HCRoom, members: Array<HCUser>) => {
		if (!room || !members) {
			return
		}
		var oldRoom: HCRoom = currentRoom.value
		currentRoom.value = room
		localStorage.setItem("room", JSON.stringify(currentRoom.value))
		currentRoomMembers.value = members;
		currentUser.value = currentRoomMembers.value.find(member => member.id == userId.value) as HCUser
		displayName.value = currentUser.value.displayName
		minutes.value = Math.floor(currentRoom.value.counter.count / 60)
		seconds.value = currentRoom.value.counter.count % 60

		roomTopicName.value = currentRoom.value.topicName
		
		sortedVotes.value = Object.values(currentRoom.value.votes).map((vote, index) => ({ vote, userId: Object.keys(currentRoom.value.votes)[index] }));
		sortedVotes.value.sort((a: any, b: any) => a.vote - b.vote);
		var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
		pieData.value.labels = votes.keys()
		pieData.value.datasets[0].data = votes.values()
		if (oldRoom.status != currentRoom.value.status && currentRoom.value.status == HCRoomStatus.voting && currentRoom.value.revote) {
			
		}
	})
	socket.on("kick", (id:string) => {
		if (id == currentUser.value.id){
			window.location.href = "/kick"
		}
	})
}


mounted()
onMounted(mounted)

definePageMeta({
	middleware: ["nullroomredirect"]
})

watch(displayName, socketSetName)
</script>

<template>
	<PermenantHeader :inRoom="true" :roomId="currentRoom.id"></PermenantHeader>
	
	<div v-if="currentUser.permissions.host && currentRoom.status != 2" class="grid grid-cols-2 grid-rows-1 m-36 mt-10 mb-0 gap-5">
		<div>
			<div class="flex justify-between" v-if="currentRoom.status == 0 && currentRoom.roomCounterEnabled">
				<div>
					<div class="w-[321px] h-[46px] bg-gray-300 dark:bg-gray-700 rounded-md flex justify-center">
						<input v-model="minutes" type="number"
							class="w-12 h-12 text-center bg-transparent text-black dark:text-gray-50 text-2xl font-light rounded-md pl-2 pr-2">
						<p class="w-fit h-fit text-[30px] pl-2 pr-2 text-black dark:text-gray-50">:</p>
						<input v-model="seconds" type="number"
							class="w-12 h-12 text-center bg-transparent text-black dark:text-gray-50 text-2xl font-light rounded-md pl-2 pr-2">
					</div>
				</div>
				<button @click="socketStartCount()" v-if="!currentRoom.counter.active" class="p-2 text-blue-800 hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Start
					Timer</button>
			</div>
			<div class="bg-gray-300 dark:bg-gray-700 mt-6 rounded-2xl">
				<div class="flex justify-between pt-5 pl-16 pr-16">
					<p class="font-bold text-black dark:text-gray-300">Name</p>
					<p class="font-bold text-black dark:text-gray-300">Status</p>
				</div>
				<div class="border-slate-400 border-t-2 mt-5 pt-6 pb-6 flex flex-col gap-2">
					<roomMemberDisplayItem v-for="member in currentRoomMembers" :user-id=userId :member=member></roomMemberDisplayItem>
				</div>
			</div>
			<div class="bg-gray-300 dark:bg-gray-700 mt-6 rounded-2xl flex p-4 w-[95%] justify-between">
					<p class="">http://localhost:3000/room?id={{ currentRoom.id }}</p>
					<svg @click="copy()" class="cursor-pointer" v-if="colormode.preference == 'dark'" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6.96558C17.9896 6.87448 17.9695 6.78473 17.94 6.69784V6.60859C17.8919 6.50662 17.8278 6.4129 17.75 6.33092L11.75 0.380993C11.6673 0.303858 11.5728 0.240258 11.47 0.192578C11.4402 0.188374 11.4099 0.188374 11.38 0.192578C11.2784 0.134806 11.1662 0.0977206 11.05 0.0834961H7C6.20435 0.0834961 5.44129 0.396929 4.87868 0.954843C4.31607 1.51276 4 2.26945 4 3.05846V4.05012H3C2.20435 4.05012 1.44129 4.36355 0.87868 4.92146C0.316071 5.47938 0 6.23607 0 7.02508V16.9416C0 17.7306 0.316071 18.4873 0.87868 19.0452C1.44129 19.6032 2.20435 19.9166 3 19.9166H11C11.7956 19.9166 12.5587 19.6032 13.1213 19.0452C13.6839 18.4873 14 17.7306 14 16.9416V15.95H15C15.7956 15.95 16.5587 15.6365 17.1213 15.0786C17.6839 14.5207 18 13.764 18 12.975V7.02508C18 7.02508 18 7.02508 18 6.96558ZM12 3.46504L14.59 6.03343H13C12.7348 6.03343 12.4804 5.92895 12.2929 5.74298C12.1054 5.55701 12 5.30477 12 5.04177V3.46504ZM12 16.9416C12 17.2046 11.8946 17.4569 11.7071 17.6428C11.5196 17.8288 11.2652 17.9333 11 17.9333H3C2.73478 17.9333 2.48043 17.8288 2.29289 17.6428C2.10536 17.4569 2 17.2046 2 16.9416V7.02508C2 6.76208 2.10536 6.50985 2.29289 6.32388C2.48043 6.1379 2.73478 6.03343 3 6.03343H4V12.975C4 13.764 4.31607 14.5207 4.87868 15.0786C5.44129 15.6365 6.20435 15.95 7 15.95H12V16.9416ZM16 12.975C16 13.238 15.8946 13.4902 15.7071 13.6762C15.5196 13.8622 15.2652 13.9667 15 13.9667H7C6.73478 13.9667 6.48043 13.8622 6.29289 13.6762C6.10536 13.4902 6 13.238 6 12.975V3.05846C6 2.79546 6.10536 2.54323 6.29289 2.35726C6.48043 2.17128 6.73478 2.06681 7 2.06681H10V5.04177C10 5.83078 10.3161 6.58748 10.8787 7.14539C11.4413 7.7033 12.2044 8.01674 13 8.01674H16V12.975Z" fill="white"/>
					</svg>
					<svg @click="copy()" class="cursor-pointer" v-else width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6.96558C17.9896 6.87448 17.9695 6.78473 17.94 6.69784V6.60859C17.8919 6.50662 17.8278 6.4129 17.75 6.33092L11.75 0.380993C11.6673 0.303858 11.5728 0.240258 11.47 0.192578C11.4402 0.188374 11.4099 0.188374 11.38 0.192578C11.2784 0.134806 11.1662 0.0977206 11.05 0.0834961H7C6.20435 0.0834961 5.44129 0.396929 4.87868 0.954843C4.31607 1.51276 4 2.26945 4 3.05846V4.05012H3C2.20435 4.05012 1.44129 4.36355 0.87868 4.92146C0.316071 5.47938 0 6.23607 0 7.02508V16.9416C0 17.7306 0.316071 18.4873 0.87868 19.0452C1.44129 19.6032 2.20435 19.9166 3 19.9166H11C11.7956 19.9166 12.5587 19.6032 13.1213 19.0452C13.6839 18.4873 14 17.7306 14 16.9416V15.95H15C15.7956 15.95 16.5587 15.6365 17.1213 15.0786C17.6839 14.5207 18 13.764 18 12.975V7.02508C18 7.02508 18 7.02508 18 6.96558ZM12 3.46504L14.59 6.03343H13C12.7348 6.03343 12.4804 5.92895 12.2929 5.74298C12.1054 5.55701 12 5.30477 12 5.04177V3.46504ZM12 16.9416C12 17.2046 11.8946 17.4569 11.7071 17.6428C11.5196 17.8288 11.2652 17.9333 11 17.9333H3C2.73478 17.9333 2.48043 17.8288 2.29289 17.6428C2.10536 17.4569 2 17.2046 2 16.9416V7.02508C2 6.76208 2.10536 6.50985 2.29289 6.32388C2.48043 6.1379 2.73478 6.03343 3 6.03343H4V12.975C4 13.764 4.31607 14.5207 4.87868 15.0786C5.44129 15.6365 6.20435 15.95 7 15.95H12V16.9416ZM16 12.975C16 13.238 15.8946 13.4902 15.7071 13.6762C15.5196 13.8622 15.2652 13.9667 15 13.9667H7C6.73478 13.9667 6.48043 13.8622 6.29289 13.6762C6.10536 13.4902 6 13.238 6 12.975V3.05846C6 2.79546 6.10536 2.54323 6.29289 2.35726C6.48043 2.17128 6.73478 2.06681 7 2.06681H10V5.04177C10 5.83078 10.3161 6.58748 10.8787 7.14539C11.4413 7.7033 12.2044 8.01674 13 8.01674H16V12.975Z" fill="black"/>
					</svg>
			</div>
		</div>
		<div v-if="currentRoom.status == 0 && currentUser.userVotingStatus != HCVotingStatus.spectating" class="m-[4.6rem]">
			<input v-model="roomTopicName" placeholder="Story Name" class="w-full bg-gray-300 dark:bg-gray-700 rounded-2xl p-6">
			<div class="mt-14 flex justify-between">
				<button v-if="currentRoom.topicName != roomTopicName" @click="socketSetTopicName()" class="p-3 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-8 pl-8 shadow hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white border border-blue-800 dark:border-orange-500">Set Story Name</button>
				<div v-else></div>
				<button @click="socketDisplayResults()" class="p-3 text-white dark:text-white text-base font-small rounded-md pr-8 pl-8 hover:text-blue-800 hover:bg-white dark:hover:bg-white dark:hover:text-orange-500 shadow bg-blue-800 dark:bg-orange-500 border border-transparent">Reveal Votes</button>
			</div>
			<div class="grid grid-cols-5 grid-rows-3 mt-16 gap-8">
				<div @click="submitVote('0', $event)" class=" dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl select-none">0</p>
				</div>
				<div @click="submitVote('1/2', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">1/2</p>
				</div>
				<div @click="socketSetCoffeeBreak(true)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 cursor-pointer dark:bg-gray-700 bg-gray-300 rounded-full text-center flex justify-center items-center" style="grid-column: span 3">
					<p class="font-medium text-xl">Coffee Break</p>
				</div>
				<div @click="submitVote('1', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">1</p>
				</div>
				<div @click="submitVote('2', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">2</p>
				</div>
				<div @click="submitVote('3', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center"  style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">3</p>
				</div>
				<div @click="submitVote('5', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center"  style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">5</p>
				</div>
				<div @click="submitVote('8', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer  bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">8</p>
				</div>
				<div @click="submitVote('13', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">13</p>
				</div>
				<div @click="submitVote('20', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">20</p>
				</div>
				<div @click="submitVote('40', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer  bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">40</p>
				</div>
				<div @click="submitVote('100', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">100</p>
				</div>
				<div @click="submitVote('?', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-full cursor-pointer  bg-gray-300 dark:bg-gray-700 rounded-full text-center flex justify-center items-center" style="aspect-ratio: 1/1;">
					<p class="font-medium text-xl">?</p>
				</div>
			</div>
			<button @click="socketLeaveRoom" v-if="colormode.preference == 'dark'" class="fixed left-[100%] top-[100%]" style="transform: translate(-150%, -150%);">
				<svg width="60" height="60" viewBox="0 0 89 89" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M28.9736 18.8756V37.7512L31.7432 40.4782L34.5128 43.2051V24.3721V5.53903H58.5867H82.6606V41.9695V78.3999H85.4302H88.1997V39.1999V-0.000100076H58.5867H28.9736V18.8756Z" fill="#F16523"/>
				<path d="M77.9739 8.18087C72.4773 9.2887 45.7191 14.9983 45.0799 15.1687C44.3556 15.3817 44.313 17.5122 44.313 51.8122C44.313 86.3252 44.3556 88.2426 45.0799 88.0296C45.4634 87.9017 51.7695 86.24 59.013 84.3652C66.2991 82.4478 74.0965 80.4026 76.3973 79.7635L80.5304 78.6983V43.4183C80.5304 24.0313 80.4026 8.05305 80.2321 7.96783C80.0191 7.88261 79.0391 7.96783 77.9739 8.18087Z" fill="#F16523"/>
				<path d="M17.0435 34.641V40.4784H8.52174H0V47.9349V55.3914H8.52174H17.0009L17.1287 61.1436L17.2565 66.8958L26.7583 57.4366L36.2174 47.9349L26.6304 38.3479L17.0435 28.761V34.641Z" fill="#F16523"/>
				<path d="M31.6154 55.519L28.9736 58.2034V68.3016V78.3999H31.7432H34.5128V65.6173C34.5128 58.5869 34.4702 52.8347 34.3849 52.8347C34.3423 52.8347 33.0641 54.0277 31.6154 55.519Z" fill="#F16523"/>
				</svg>
			</button>
			<button @click="socketLeaveRoom"  v-if="colormode.preference == 'light'" class="fixed left-[100%] top-[100%]" style="transform: translate(-150%, -150%);">
				<svg width="60" height="60" viewBox="0 0 89 89" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M28.9736 18.8756V37.7512L31.7432 40.4782L34.5128 43.2051V24.3721V5.53903H58.5867H82.6606V41.9695V78.3999H85.4302H88.1997V39.1999V-0.000100076H58.5867H28.9736V18.8756Z" fill="#F16523"/>
				<path d="M77.9739 8.18087C72.4773 9.2887 45.7191 14.9983 45.0799 15.1687C44.3556 15.3817 44.313 17.5122 44.313 51.8122C44.313 86.3252 44.3556 88.2426 45.0799 88.0296C45.4634 87.9017 51.7695 86.24 59.013 84.3652C66.2991 82.4478 74.0965 80.4026 76.3973 79.7635L80.5304 78.6983V43.4183C80.5304 24.0313 80.4026 8.05305 80.2321 7.96783C80.0191 7.88261 79.0391 7.96783 77.9739 8.18087Z" fill="#2255BE"/>
				<path d="M17.0435 34.641V40.4784H8.52174H0V47.9349V55.3914H8.52174H17.0009L17.1287 61.1436L17.2565 66.8958L26.7583 57.4366L36.2174 47.9349L26.6304 38.3479L17.0435 28.761V34.641Z" fill="#F16523"/>
				<path d="M31.6154 55.519L28.9736 58.2034V68.3016V78.3999H31.7432H34.5128V65.6173C34.5128 58.5869 34.4702 52.8347 34.3849 52.8347C34.3423 52.8347 33.0641 54.0277 31.6154 55.519Z" fill="#F16523"/>
				</svg>
			</button>
		</div>
		<div v-if="currentRoom.status == 1" class="m-[4.6rem] mt-0 flex justify-center flex-col">
			<h1 class="w-full bg-gray-300 dark:bg-gray-700 rounded-2xl pb-5 p-6 mb-5">{{ currentRoom.topicName }}</h1>
			<div class="flex justify-between mb-4">
				<button @click="selectedChart = 'pie'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Pie Chart</button>
				<button @click="selectedChart = 'donut'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Donut Chart</button>
				<button @click="selectedChart = 'bar'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Bar Chart</button>
			</div>
			<Pie v-if="selectedChart == 'pie'" :data="pieData" :options="chartOptions" />
			<Bar v-if="selectedChart == 'bar'" :data="pieData" :options="chartOptions" />
			<Doughnut v-if="selectedChart == 'donut'" :data="pieData" :options="chartOptions" />

			<div class="flex justify-center gap-8 mt-10">
				<button @click="socketRevote()" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Revote</button>
				<button @click="showStoryPointsPrompt = true" class="p-2 text-white text-base font-small rounded-md pr-4 pl-4 shadow dark:bg-orange-500 bg-blue-800">New Story</button>
				<ModalPopup v-if="showStoryPointsPrompt">
					<SetStoryPointsPromt @set-story-points="(points) => socketNewTopic(points)"></SetStoryPointsPromt>
				</ModalPopup>
			</div>
		</div>
	</div>
	<div v-if="!currentUser.permissions.host && currentRoom.status != 2" class="flex m-36 mt-10 mb-0 justify-between">
		<div>
			<div class="flex justify-between" v-if="currentRoom.status == 0 && currentRoom.roomCounterEnabled">
				<div>
					<div class="w-[321px] h-[46px] bg-gray-300 dark:bg-gray-700 rounded-md flex justify-center">
						<input disabled type="number"
							class="w-12 h-12 text-center bg-transparent ext-black dark:text-gray-50 text-2xl font-light rounded-md pl-2 pr-2"
							value="00">
						<p class="w-fit h-fit text-[30px] pl-2 pr-2 ext-black dark:text-gray-50">:</p>
						<input disabled type="number"
							class="w-12 h-12 text-center bg-transparent text-black dark:text-gray-50 text-2xl font-light rounded-md pl-2 pr-2"
							value="00">
					</div>
				</div>
			</div>
			<div class="w-[358px] bg-gray-300 dark:bg-gray-700 mt-6 rounded-2xl">
				<div class="flex justify-between pt-5 pl-16 pr-16">
					<p class="font-bold text-black dark:text-gray-300">Name</p>
					<p class="font-bold text-black dark:text-gray-300">Status</p>
				</div>
				<div class="border-slate-400 border-t-2 mt-5 pt-6 pb-6 flex flex-col gap-2">
					<roomMemberDisplayItem v-for="member in  currentRoomMembers" :user-id=userId :member=member></roomMemberDisplayItem>
				</div>
			</div>
			<div class="bg-gray-300 dark:bg-gray-700 mt-6 rounded-2xl flex p-4 w-[100%]">
					<p class="pr-2">http://localhost:3000/room?id={{ currentRoom.id }}</p>
					<svg v-if="colormode.preference == 'dark'" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6.96558C17.9896 6.87448 17.9695 6.78473 17.94 6.69784V6.60859C17.8919 6.50662 17.8278 6.4129 17.75 6.33092L11.75 0.380993C11.6673 0.303858 11.5728 0.240258 11.47 0.192578C11.4402 0.188374 11.4099 0.188374 11.38 0.192578C11.2784 0.134806 11.1662 0.0977206 11.05 0.0834961H7C6.20435 0.0834961 5.44129 0.396929 4.87868 0.954843C4.31607 1.51276 4 2.26945 4 3.05846V4.05012H3C2.20435 4.05012 1.44129 4.36355 0.87868 4.92146C0.316071 5.47938 0 6.23607 0 7.02508V16.9416C0 17.7306 0.316071 18.4873 0.87868 19.0452C1.44129 19.6032 2.20435 19.9166 3 19.9166H11C11.7956 19.9166 12.5587 19.6032 13.1213 19.0452C13.6839 18.4873 14 17.7306 14 16.9416V15.95H15C15.7956 15.95 16.5587 15.6365 17.1213 15.0786C17.6839 14.5207 18 13.764 18 12.975V7.02508C18 7.02508 18 7.02508 18 6.96558ZM12 3.46504L14.59 6.03343H13C12.7348 6.03343 12.4804 5.92895 12.2929 5.74298C12.1054 5.55701 12 5.30477 12 5.04177V3.46504ZM12 16.9416C12 17.2046 11.8946 17.4569 11.7071 17.6428C11.5196 17.8288 11.2652 17.9333 11 17.9333H3C2.73478 17.9333 2.48043 17.8288 2.29289 17.6428C2.10536 17.4569 2 17.2046 2 16.9416V7.02508C2 6.76208 2.10536 6.50985 2.29289 6.32388C2.48043 6.1379 2.73478 6.03343 3 6.03343H4V12.975C4 13.764 4.31607 14.5207 4.87868 15.0786C5.44129 15.6365 6.20435 15.95 7 15.95H12V16.9416ZM16 12.975C16 13.238 15.8946 13.4902 15.7071 13.6762C15.5196 13.8622 15.2652 13.9667 15 13.9667H7C6.73478 13.9667 6.48043 13.8622 6.29289 13.6762C6.10536 13.4902 6 13.238 6 12.975V3.05846C6 2.79546 6.10536 2.54323 6.29289 2.35726C6.48043 2.17128 6.73478 2.06681 7 2.06681H10V5.04177C10 5.83078 10.3161 6.58748 10.8787 7.14539C11.4413 7.7033 12.2044 8.01674 13 8.01674H16V12.975Z" fill="white"/>
					</svg>
					<svg v-else width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 9.77369C20.9896 9.68259 20.9695 9.59284 20.94 9.50594V9.41669C20.8919 9.31473 20.8278 9.221 20.75 9.13903L14.75 3.1891C14.6673 3.11196 14.5728 3.04836 14.47 3.00068C14.4402 2.99648 14.4099 2.99648 14.38 3.00068C14.2784 2.94291 14.1662 2.90583 14.05 2.8916H10C9.20435 2.8916 8.44129 3.20503 7.87868 3.76295C7.31607 4.32086 7 5.07756 7 5.86657V6.85822H6C5.20435 6.85822 4.44129 7.17165 3.87868 7.72957C3.31607 8.28748 3 9.04418 3 9.83319V19.7497C3 20.5387 3.31607 21.2954 3.87868 21.8534C4.44129 22.4113 5.20435 22.7247 6 22.7247H14C14.7956 22.7247 15.5587 22.4113 16.1213 21.8534C16.6839 21.2954 17 20.5387 17 19.7497V18.7581H18C18.7956 18.7581 19.5587 18.4446 20.1213 17.8867C20.6839 17.3288 21 16.5721 21 15.7831V9.83319C21 9.83319 21 9.83319 21 9.77369ZM15 6.27315L17.59 8.84153H16C15.7348 8.84153 15.4804 8.73705 15.2929 8.55108C15.1054 8.36511 15 8.11288 15 7.84988V6.27315ZM15 19.7497C15 20.0127 14.8946 20.265 14.7071 20.4509C14.5196 20.6369 14.2652 20.7414 14 20.7414H6C5.73478 20.7414 5.48043 20.6369 5.29289 20.4509C5.10536 20.265 5 20.0127 5 19.7497V9.83319C5 9.57018 5.10536 9.31795 5.29289 9.13198C5.48043 8.94601 5.73478 8.84153 6 8.84153H7V15.7831C7 16.5721 7.31607 17.3288 7.87868 17.8867C8.44129 18.4446 9.20435 18.7581 10 18.7581H15V19.7497ZM19 15.7831C19 16.0461 18.8946 16.2984 18.7071 16.4843C18.5196 16.6703 18.2652 16.7748 18 16.7748H10C9.73478 16.7748 9.48043 16.6703 9.29289 16.4843C9.10536 16.2984 9 16.0461 9 15.7831V5.86657C9 5.60356 9.10536 5.35133 9.29289 5.16536C9.48043 4.97939 9.73478 4.87491 10 4.87491H13V7.84988C13 8.63889 13.3161 9.39558 13.8787 9.9535C14.4413 10.5114 15.2044 10.8248 16 10.8248H19V15.7831Z" fill="black"/>
					</svg>
			</div>
		</div>
		<div v-if="currentRoom.status == 0 && currentUser.userVotingStatus != HCVotingStatus.spectating">
			<p class="w-full bg-gray-300 dark:bg-gray-700 rounded-2xl p-6">{{ roomTopicName }}</p>
			<div class="grid grid-cols-5 grid-rows-3 mt-6 gap-8">
				<div @click="submitVote('0', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">0</p>
				</div>
				<div @click="submitVote('1/2', $event)" class="cursor-pointer  dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">1/2</p>
				</div>
				<div @click="submitVote('1', $event)" class="cursor-pointer  dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">1</p>
				</div>
				<div @click="submitVote('2', $event)" class="cursor-pointer  dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">2</p>
				</div>
				<div @click="submitVote('3', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">3</p>
				</div>
				<div @click="submitVote('5', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">5</p>
				</div>
				<div @click="submitVote('8', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">8</p>
				</div>
				<div @click="submitVote('13', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">13</p>
				</div>
				<div @click="submitVote('20', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">20</p>
				</div>
				<div @click="submitVote('40', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
					<p class="font-medium text-xl">40</p>
				</div>
				<div class="flex justify-center gap-8" style="grid-column: span 5;">
					<div @click="submitVote('100', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
						<p class="font-medium text-xl">100</p>
					</div>
					<div @click="submitVote('?', $event)" class="cursor-pointer dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 w-[102px] h-[171px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow text-center flex justify-center items-center">
						<p class="font-medium text-xl">?</p>
					</div>
					<div @click="submitVote('Coffee Break', $event)" class="dark:hover:bg-orange-500 hover:bg-blue-800 hover:text-gray-300 cursor-pointer dark:bg-gray-700 bg-gray-300 w-[102px] h-[171px] rounded-xl shadow text-center flex justify-center items-center" style="grid-column: span 3">
						<p class="font-medium text-xl">☕︎</p>
					</div>
				</div>
			</div>
		</div>
		<div v-if="currentRoom.status == 1" class="mt-0 flex justify-center items-center flex-col">
			<h1 class="w-full bg-gray-300 dark:bg-gray-700 rounded-2xl pb-5 p-6 mb-5">{{ currentRoom.topicName }}</h1>
			<div class="flex justify-center items-center">
				<Pie v-if="selectedChart == 'pie'" :data="pieData" :options="chartOptions" />
				<Bar v-if="selectedChart == 'bar'" :data="pieData" :options="chartOptions" />
				<Doughnut v-if="selectedChart == 'donut'" :data="pieData" :options="chartOptions" />
				<div class="flex flex-col mb-4 ml-20 gap-6">
					<button @click="selectedChart = 'pie'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Pie Chart</button>
					<button @click="selectedChart = 'donut'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Donut Chart</button>
					<button @click="selectedChart = 'bar'" class="p-2 text-blue-800 dark:text-orange-500 text-base font-small rounded-md pr-4 pl-4 shadow border border-blue-800 dark:border-orange-500">Bar Chart</button>
				</div>
			</div>
		</div>

	</div>
	<div v-if="currentRoom.status == 2" class="flex items-center flex-col" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);">
		<div v-if="!currentUser.permissions.host" class="flex items-center flex-col">
			<h1 class="w-96 text-center text-black dark:text-gray-50 text-5xl font-bold">Coffee Break!</h1>
			<p class="w-96 text-center text-black dark:text-gray-50 text-xl font-medium leading-loose">Wait Here Till The Host Ends The Break...</p>
			<svg width="358" height="358" viewBox="0 0 358 358" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path v-if="colormode.preference == 'dark'" d="M134.25 253.583H193.917C213.698 253.583 232.668 245.725 246.655 231.738C260.642 217.751 268.5 198.781 268.5 179V164.083H283.417C295.285 164.083 306.668 159.369 315.06 150.976C323.452 142.584 328.167 131.202 328.167 119.333C328.167 107.465 323.452 96.0826 315.06 87.6903C306.668 79.2981 295.285 74.5833 283.417 74.5833H268.5V59.6667C268.5 55.7105 266.929 51.9164 264.131 49.119C261.334 46.3216 257.54 44.75 253.583 44.75H74.5835C70.6273 44.75 66.8332 46.3216 64.0358 49.119C61.2384 51.9164 59.6668 55.7105 59.6668 59.6667V179C59.6668 198.781 67.5247 217.751 81.5118 231.738C95.4989 245.725 114.469 253.583 134.25 253.583ZM268.5 104.417H283.417C287.373 104.417 291.167 105.988 293.965 108.786C296.762 111.583 298.333 115.377 298.333 119.333C298.333 123.289 296.762 127.084 293.965 129.881C291.167 132.678 287.373 134.25 283.417 134.25H268.5V104.417ZM89.5002 74.5833H238.667V179C238.667 190.868 233.952 202.251 225.56 210.643C217.168 219.035 205.785 223.75 193.917 223.75H134.25C122.382 223.75 110.999 219.035 102.607 210.643C94.2149 202.251 89.5002 190.868 89.5002 179V74.5833ZM313.25 283.417H44.7502C40.794 283.417 36.9999 284.988 34.2025 287.786C31.4051 290.583 29.8335 294.377 29.8335 298.333C29.8335 302.289 31.4051 306.084 34.2025 308.881C36.9999 311.678 40.794 313.25 44.7502 313.25H313.25C317.206 313.25 321 311.678 323.798 308.881C326.595 306.084 328.167 302.289 328.167 298.333C328.167 294.377 326.595 290.583 323.798 287.786C321 284.988 317.206 283.417 313.25 283.417Z" fill="#F7F8F9"/>
				<path v-if="colormode.preference == 'light'" d="M134.25 253.583H193.917C213.698 253.583 232.668 245.725 246.655 231.738C260.642 217.751 268.5 198.781 268.5 179V164.083H283.417C295.285 164.083 306.668 159.369 315.06 150.976C323.452 142.584 328.167 131.202 328.167 119.333C328.167 107.465 323.452 96.0826 315.06 87.6903C306.668 79.2981 295.285 74.5833 283.417 74.5833H268.5V59.6667C268.5 55.7105 266.929 51.9164 264.131 49.119C261.334 46.3216 257.54 44.75 253.583 44.75H74.5835C70.6273 44.75 66.8332 46.3216 64.0358 49.119C61.2384 51.9164 59.6668 55.7105 59.6668 59.6667V179C59.6668 198.781 67.5247 217.751 81.5118 231.738C95.4989 245.725 114.469 253.583 134.25 253.583ZM268.5 104.417H283.417C287.373 104.417 291.167 105.988 293.965 108.786C296.762 111.583 298.333 115.377 298.333 119.333C298.333 123.289 296.762 127.084 293.965 129.881C291.167 132.678 287.373 134.25 283.417 134.25H268.5V104.417ZM89.5002 74.5833H238.667V179C238.667 190.868 233.952 202.251 225.56 210.643C217.168 219.035 205.785 223.75 193.917 223.75H134.25C122.382 223.75 110.999 219.035 102.607 210.643C94.2149 202.251 89.5002 190.868 89.5002 179V74.5833ZM313.25 283.417H44.7502C40.794 283.417 36.9999 284.988 34.2025 287.786C31.4051 290.583 29.8335 294.377 29.8335 298.333C29.8335 302.289 31.4051 306.084 34.2025 308.881C36.9999 311.678 40.794 313.25 44.7502 313.25H313.25C317.206 313.25 321 311.678 323.798 308.881C326.595 306.084 328.167 302.289 328.167 298.333C328.167 294.377 326.595 290.583 323.798 287.786C321 284.988 317.206 283.417 313.25 283.417Z" fill="#000000"/>
			</svg>
		</div>
		<div v-else class="flex items-center flex-col">
			<h1 class="w-96 text-center text-black dark:text-gray-50 text-5xl font-bold">Coffee Break!</h1>
			<p class="w-96 text-center text-black dark:text-gray-50 text-xl font-medium leading-loose">Click The Button To Start Again...</p>
			<svg width="358" height="358" viewBox="0 0 358 358" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path v-if="colormode.preference == 'dark'" d="M134.25 253.583H193.917C213.698 253.583 232.668 245.725 246.655 231.738C260.642 217.751 268.5 198.781 268.5 179V164.083H283.417C295.285 164.083 306.668 159.369 315.06 150.976C323.452 142.584 328.167 131.202 328.167 119.333C328.167 107.465 323.452 96.0826 315.06 87.6903C306.668 79.2981 295.285 74.5833 283.417 74.5833H268.5V59.6667C268.5 55.7105 266.929 51.9164 264.131 49.119C261.334 46.3216 257.54 44.75 253.583 44.75H74.5835C70.6273 44.75 66.8332 46.3216 64.0358 49.119C61.2384 51.9164 59.6668 55.7105 59.6668 59.6667V179C59.6668 198.781 67.5247 217.751 81.5118 231.738C95.4989 245.725 114.469 253.583 134.25 253.583ZM268.5 104.417H283.417C287.373 104.417 291.167 105.988 293.965 108.786C296.762 111.583 298.333 115.377 298.333 119.333C298.333 123.289 296.762 127.084 293.965 129.881C291.167 132.678 287.373 134.25 283.417 134.25H268.5V104.417ZM89.5002 74.5833H238.667V179C238.667 190.868 233.952 202.251 225.56 210.643C217.168 219.035 205.785 223.75 193.917 223.75H134.25C122.382 223.75 110.999 219.035 102.607 210.643C94.2149 202.251 89.5002 190.868 89.5002 179V74.5833ZM313.25 283.417H44.7502C40.794 283.417 36.9999 284.988 34.2025 287.786C31.4051 290.583 29.8335 294.377 29.8335 298.333C29.8335 302.289 31.4051 306.084 34.2025 308.881C36.9999 311.678 40.794 313.25 44.7502 313.25H313.25C317.206 313.25 321 311.678 323.798 308.881C326.595 306.084 328.167 302.289 328.167 298.333C328.167 294.377 326.595 290.583 323.798 287.786C321 284.988 317.206 283.417 313.25 283.417Z" fill="#F7F8F9"/>
				<path v-if="colormode.preference == 'light'" d="M134.25 253.583H193.917C213.698 253.583 232.668 245.725 246.655 231.738C260.642 217.751 268.5 198.781 268.5 179V164.083H283.417C295.285 164.083 306.668 159.369 315.06 150.976C323.452 142.584 328.167 131.202 328.167 119.333C328.167 107.465 323.452 96.0826 315.06 87.6903C306.668 79.2981 295.285 74.5833 283.417 74.5833H268.5V59.6667C268.5 55.7105 266.929 51.9164 264.131 49.119C261.334 46.3216 257.54 44.75 253.583 44.75H74.5835C70.6273 44.75 66.8332 46.3216 64.0358 49.119C61.2384 51.9164 59.6668 55.7105 59.6668 59.6667V179C59.6668 198.781 67.5247 217.751 81.5118 231.738C95.4989 245.725 114.469 253.583 134.25 253.583ZM268.5 104.417H283.417C287.373 104.417 291.167 105.988 293.965 108.786C296.762 111.583 298.333 115.377 298.333 119.333C298.333 123.289 296.762 127.084 293.965 129.881C291.167 132.678 287.373 134.25 283.417 134.25H268.5V104.417ZM89.5002 74.5833H238.667V179C238.667 190.868 233.952 202.251 225.56 210.643C217.168 219.035 205.785 223.75 193.917 223.75H134.25C122.382 223.75 110.999 219.035 102.607 210.643C94.2149 202.251 89.5002 190.868 89.5002 179V74.5833ZM313.25 283.417H44.7502C40.794 283.417 36.9999 284.988 34.2025 287.786C31.4051 290.583 29.8335 294.377 29.8335 298.333C29.8335 302.289 31.4051 306.084 34.2025 308.881C36.9999 311.678 40.794 313.25 44.7502 313.25H313.25C317.206 313.25 321 311.678 323.798 308.881C326.595 306.084 328.167 302.289 328.167 298.333C328.167 294.377 326.595 290.583 323.798 287.786C321 284.988 317.206 283.417 313.25 283.417Z" fill="#000000"/>
			</svg>
			<button @click="socketSetCoffeeBreak(false)" class="p-3 text-white dark:text-white text-base font-small rounded-md pr-8 pl-8 shadow bg-blue-800 dark:bg-orange-500 border border-transparent">End Coffee Break</button>
		</div>
	</div>
</template>
