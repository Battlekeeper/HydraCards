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
import { Pie, Bar } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const pieData = ref({
	labels: [''],
	datasets: [
		{
			label: 'Data One',
			backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
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

const socket = io(config.public.baseUrl.replace("http", "ws"));
const displayName = ref("")
const roomTopicName = ref("")
const countDownTime = ref()
const cards = ref([0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100])
const selectedCard = ref(-1)
const selectedCardLast = ref(-1)
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const currentRoomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)
const userId: Ref<string> = ref(useCookie('_id').value as string)
var roomId: string = route.currentRoute.value.query.id as string
const sortedVotes = ref()
const showQRCodeModal = ref(false)

const { data: room } = await useFetch(`api/room/getRoomById?id=` + roomId, { baseURL: config.public.serverUrl })
currentRoom.value = room.value as HCRoom

var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
pieData.value.labels = votes.keys()
pieData.value.datasets[0].data = votes.values()


const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.serverUrl })
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
function socketNewTopic() {
	socket.emit("revote", currentRoom.value.id, userId.value, false)
	roomTopicName.value = ""
	socket.emit("setRoomTopicName", currentRoom.value.id, currentUser.value.id, "")
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
function submitVote(vote: number) {
	socket.emit("submitVote", Number.parseInt(roomId), userId.value, vote)
}
function setCardActive(cardId: number) {
	selectedCard.value = cardId
}
async function switchSpectatorMode(mode: boolean) {
	await useFetch(`api/user/setSpectatorMode?mode=` + mode, { baseURL: config.public.baseUrl })
	selectedCard.value = -1
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
	socket.emit("startCount", currentRoom.value.id, currentUser.value.id, countDownTime.value)
}
function copy() {
	navigator.clipboard.writeText(window.location.href)
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

onMounted(async () => {
	socket.on("connect", () => {
		socket.emit("joinSocketRoom", Number.parseInt(roomId), userId.value as string)
		socket.emit("setSocketId", currentUser.value.id)
		setInterval(()=>{socket.emit("onlinePing", currentUser.value.id)}, 1000)
	})
	socket.on("roomStateUpdate", (room: HCRoom, members: Array<HCUser>) => {
		if (!room || !members) {
			return
		}
		var oldRoom: HCRoom = currentRoom.value
		currentRoom.value = room
		currentRoomMembers.value = members;
		currentUser.value = currentRoomMembers.value.find(member => member.id == userId.value) as HCUser
		displayName.value = currentUser.value.displayName
		roomTopicName.value = currentRoom.value.topicName

		sortedVotes.value = Object.values(currentRoom.value.votes).map((vote, index) => ({ vote, userId: Object.keys(currentRoom.value.votes)[index] }));
		sortedVotes.value.sort((a: any, b: any) => a.vote - b.vote);
		var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
		pieData.value.labels = votes.keys()
		pieData.value.datasets[0].data = votes.values()
		if (oldRoom.status != currentRoom.value.status && currentRoom.value.status == HCRoomStatus.voting && currentRoom.value.revote) {
			var temp = selectedCard.value
			nextTick(() => {
				setCardActive(-1)
				nextTick(() => {
					setCardActive(temp)
				})
			})
		}
	})
})

definePageMeta({
	middleware: ["nullroomredirect"]
})

watch(displayName, socketSetName)

if (!isInRoom() || currentUser.value.displayName == "" || currentUser.value.displayName == undefined) {
	route.push({ path: "/name", query: { id: currentRoom.value.id } });
}
</script>
<template>
	<div v-if="isInRoom() && currentUser.displayName != '' && currentUser.displayName != undefined">
		<div class="flex">
			<button @click="showQRCodeModal = !showQRCodeModal" class="my-4">
				<span class="px-2 py-2 m-2 hover:bg-gray-700 text-white bg-gray-500 rounded-lg text-sm">Show QR Code</span>
			</button>
			<div v-show="showQRCodeModal" @click="showQRCodeModal = false">
				<ModalPopup><qrCode :size="256" :pagelink="true"></qrCode></ModalPopup>
			</div>
			<button @click="copy()" class="my-4">
				<span class="px-2 py-2 m-2 hover:bg-gray-700 text-white bg-gray-500 rounded-lg text-sm">Copy URL</span>
			</button>
			<button>
				<span class="px-2 py-2 m-2 text-white bg-gray-500 rounded-lg text-sm">{{ currentRoom.id }}</span>
			</button>
		</div>
		<div v-if="currentRoom.status == HCRoomStatus.voting">
			<div class="flex flex-col items-center justify-center">
				<input type="text" v-show="currentUser.permissions.host" placeholder="Insert topic title"
					v-model="roomTopicName" class="h-20 text-4xl text-center" />
				<button
					class="place-content-center px-3 py-1 m-1 hover:bg-green-700 text-white bg-green-500 rounded-lg text-sm"
					v-show="currentUser.permissions.host" @click="socketSetTopicName()">Set Title</button>
				<h1 v-show="currentRoom.topicName != '' && !currentUser.permissions.host"
					class="text-4xl md:text-5xl text-center">{{ currentRoom.topicName }}</h1>
			</div>
			<div v-if="!currentRoom.counter.active && currentUser.permissions.host">
				<input type="text" placeholder="Countdown in seconds" v-model="countDownTime" class="border-2 border-black">
				<button @click="socketStartCount"
					class="px-3 py-1 m-1 hover:bg-yellow-700 text-white bg-yellow-500 rounded-lg text-sm">Start
					Countdown</button>
			</div>
			<h1 v-if="currentRoom.counter.active">{{ currentRoom.counter.count }} seconds left to vote</h1>

			<br>
			<div v-for="member in  currentRoomMembers">
				<roomMemberDisplayItem :member=member></roomMemberDisplayItem>
			</div>
			<button @click="socketLeaveRoom"
				class="px-5 py-2 m-5 hover:bg-blue-700 text-white bg-blue-500 rounded-lg text-lg">Leave
				Room</button>
			<button v-show="currentUser.permissions.host" @click="socketDisplayResults"
				class="px-5 py-2 m-5 hover:bg-indigo-700 text-white bg-indigo-500 rounded-lg text-lg">Display
				Results</button>
			<button v-if="currentUser.userVotingStatus != 1" @click="switchSpectatorMode(true)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg text-lg">Switch to spectator
				mode</button>
			<button v-else @click="switchSpectatorMode(false)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg">Switch to voting mode</button>
			<div>
				<voteCard v-for="card in cards" :cardId=card :userVotingStatus=currentUser.userVotingStatus
					:selectedCard=selectedCard @click="submitVote(card); setCardActive(card)">{{ card }}</voteCard>
			</div>
			<div class="border-2 border-indigo-600">
			<p>Room History:</p>
				<topicHistoryItem v-for="(topic, index) in currentRoom.history" @downloadClick="downloadTopicCSV(index, topic.TopicName)" class="flex ">
					{{ topic.TopicName }}</topicHistoryItem>
			</div>
			<p class="text-center text-xs">{{ currentRoom }}</p> 
		</div>
		<div v-else>
			<p class="text-center">Here Are The Results for Topic: {{ currentRoom.topicName }}</p>
			<voteResultNameDisplay v-for="voteObj in sortedVotes" :voteObj=voteObj>
			</voteResultNameDisplay>
			<button v-if="currentUser.permissions.host" @click="socketRevote()"
				class="px-5 py-2 m-5 hover:bg-yellow-700 text-white bg-yellow-500 rounded-lg">Revote</button>
			<button @click="socketLeaveRoom" class="px-5 py-2 m-5 hover:bg-blue-700 text-white bg-blue-500 rounded-lg">Leave
				Room</button>
			<button @click="socketNewTopic()" v-show="currentUser.permissions.host"
			class="px-5 py-2 m-5 hover:bg-orange-700 text-white bg-orange-500 rounded-lg">New Topic</button>
		<Pie :data="pieData" :options="chartOptions" />
		<Bar :data="pieData" :options="chartOptions" />
		<button @click="downloadCharts"
			class="px-5 py-2 m-5 hover:bg-gray-700 text-white bg-gray-500 rounded-lg">Download Chart PNG</button>
	</div>
</div></template>
