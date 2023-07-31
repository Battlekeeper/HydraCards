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
const colormode = useColorMode()

const socket = io(config.public.baseUrl.replace("http", "ws"));
const displayName = ref("")
const roomTopicName = ref("")
const countDownTime = ref()
const cards = ref([0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, 0, 0])
const selectedCard = ref(-1)
const selectedCardLast = ref(-1)
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const currentRoomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)
const userId: Ref<string> = ref(useCookie('_id').value as string)
var roomId: string = route.currentRoute.value.query.id as string
const sortedVotes = ref()
const showQRCodeModal = ref(false)
const minutes = ref(0)
const seconds = ref(0)

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

onMounted(async () => {
	socket.on("connect", () => {
		socket.emit("joinSocketRoom", Number.parseInt(roomId), userId.value as string)
		socket.emit("setSocketId", currentUser.value.id)
		setInterval(() => { socket.emit("onlinePing", currentUser.value.id) }, 1000)
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
	<PermenantHeader :inRoom="true"></PermenantHeader>
	<div v-if="isInRoom() && currentUser.displayName != '' && currentUser.displayName != undefined" class="h-screen bg-slate-50 dark:bg-DarkGrey">
		<!--<div class="flex">
			<button @click="showQRCodeModal = !showQRCodeModal" class="my-4">
				<span class="px-2 py-2 m-2 hover:bg-gray-700 text-slate-50 bg-gray-500 rounded-lg text-sm">Show QR Code</span>
			</button>
			<div v-show="showQRCodeModal" @click="showQRCodeModal = false">
				<ModalPopup><qrCode :size="256" :pagelink="true"></qrCode></ModalPopup>
			</div>
			
			<button>
				<span class="px-2 py-2 m-2 text-slate-50 bg-gray-500 rounded-lg text-sm">{{ currentRoom.id }}</span>
			</button>
		</div>-->
		<div v-if="currentRoom.status == HCRoomStatus.voting">
			<div>
				<div class="absolute h-screen right-60 top-32">
					<div class="text-slate-300 mb-2">Story Title</div>
					<div class="gap-8 inline-flex">
						<div v-show="currentUser.permissions.host"
							class="w-64 h-16 pl-4 pr-36 py-5 bg-gray-300 dark:bg-slate-600 rounded-md gap-2.5 flex">
							<div class="text-slate-300 text-base font-normal leading-normal">
								<input type="text" placeholder="Story Title" class="bg-gray-300 dark:bg-slate-600"
									v-model="roomTopicName" />
							</div>
						</div>
						<div class="justify-start items-start gap-9 flex">
							<div class="justify-start items-start flex">
								<div class="justify-start items-start flex">
									<div class="w-40 h-11 justify-start items-start flex">
										<div v-show="currentUser.permissions.host"
											class="w-40 h-11 px-4 py-3 bg-blue-800 dark:bg-orange-500 dark:hover:bg-slate-600 hover:border dark:hover:border-orange-500 hover:border-blue-800 hover:bg-slate-50 dark:hover:text-orange-500 rounded-md shadow justify-center items-center gap-2 flex">
											<div
												class="dark:hover:text-orange-500 text-white hover:text-blue-800 text-base font-medium leading-normal">
												<button @click="socketSetTopicName()">Set Title</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="justify-start items-start flex">
								<div class="justify-start items-start flex">
									<div class="w-40 h-11 justify-start items-start flex">
										<div v-show="currentUser.permissions.host"
											class="w-40 h-11 px-4 py-3 bg-blue-800 dark:bg-orange-500 hover:border dark:hover:bg-slate-600 dark:hover:border-orange-500 hover:border-blue-800 hover:bg-slate-50 dark:hover:text-orange-500 rounded-md shadow justify-center items-center gap-2 flex">
											<div
												class="dark:hover:text-orange-500 text-white hover:text-blue-800 text-base font-medium leading-normal">
												<h1 v-show="currentRoom.topicName != '' && !currentUser.permissions.host"
													class="text-4xl md:text-5xl text-center">{{ currentRoom.topicName }}
												</h1>
												<button v-show="currentUser.permissions.host"
													@click="socketDisplayResults">Reveal Votes</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		
				<div>
					<div
						class="gap-2 grid gap-x-20 gap-y-8 grid-cols-5 grid-rows-3 absolute top-64 right-64">
						<voteCard v-for="card in cards" :cardId=card :userVotingStatus=currentUser.userVotingStatus
							:selectedCard=selectedCard @click="submitVote(card); setCardActive(card)">{{ card }}</voteCard>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!currentRoom.counter.active && currentUser.permissions.host">
			<div class="w-80 h-11 justify-center items-center inline-flex absolute left-32 top-40">
				<div class="flex-col justify-start items-start gap-1.5 inline-flex">
					<div class="flex-col justify-start items-start gap-1.5 flex">
						<div
							class="w-80 h-10 px-3.5 py-2.5 bg-gray-300 dark:bg-slate-600 rounded-lg justify-start items-center gap-2 inline-flex">
							<div class="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">

								<Countdown></Countdown>


								<!--<input type="text" placeholder="Countdown in seconds" v-model="countDownTime" class="grow shrink basis-0 text-center text-gray-50 text-lg font-normal bg-slate-600 leading-loose">
								<button @click="socketStartCount"
							class="px-3 py-0.5 m-1 hover:bg-orange-600 text-slate-50 bg-orange-500 rounded-lg text-sm">Start
							Countdown</button>-->

							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<h1 v-if="currentRoom.counter.active">{{ currentRoom.counter.count }} seconds left to vote</h1>

		<br>
		<div class="w-96 h-96 flex-col items-center gap-5 inline-flex absolute top-56 left-24">
			<div class="bg-gray-300 dark:bg-slate-600 rounded-2xl flex-">
				<div class="pl-1 pr-2.5 py-2.5 inline-flex">
					<div class="pl-11 items-center gap-44 flex">
						<div class="p-2.5 ">
							<div class="dark:text-slate-400 font-semibold">Name</div>
						</div>
						<div class="dark:text-slate-400 font-semibold">Vote</div>
					</div>
				</div>
				<div class="border border-slate-400"></div>
				<div class="px-6 py-4 flex-col justify-start items-start gap-4 flex">
					<roomMemberDisplayItem v-for="member in  currentRoomMembers" :member=member></roomMemberDisplayItem>
				</div>
			</div>

			<div class="w-80 h-11 relative">
				<div class="w-80 h-11 px-3.5 py-2.5 bg-gray-300 dark:bg-slate-600 rounded-lg">
					<p class="dark:text-slate-300 text-base font-normal leading-normal">
						localhost:3000/room?id={{ currentRoom.id }}
					</p>
					<img v-show="colormode.preference != 'dark'" @click="copy()" src="/images/copy_paste_black.png"
						style="width: 25px; height: 25px" class="relative left-64 bottom-6 hover:bg-slate-700">
					<img v-show="colormode.preference == 'dark'" @click="copy()" src="/images/copy_paste_white.png"
						style="width: 25px; height: 25px" class="relative left-64 bottom-6 hover:bg-slate-700">
				</div>
				<div class="w-6 h-6 left-[286px] top-[10.91px] absolute"></div>
			</div>
		</div>

		<!--<button @click="socketLeaveRoom"
				class="px-5 py-2 m-5 hover:bg-blue-700 text-slate-50 bg-blue-500 rounded-lg text-lg">Leave
				Room</button>-->

		<!--<button v-if="currentUser.userVotingStatus != 1" @click="switchSpectatorMode(true)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-slate-50 bg-red-500 rounded-lg text-lg">Switch to spectator
				mode</button>
			<button v-else @click="switchSpectatorMode(false)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-slate-50 bg-red-500 rounded-lg">Switch to voting mode
			</button>-->
		<div class=" dark:bg-DarkGrey">
			<!--<div class="border-2 border-indigo-600 w-80 rounded-lg  dark:bg-DarkGrey">
			<p>Room History:</p>
				<topicHistoryItem v-for="(topic, index) in currentRoom.history" @downloadClick="downloadTopicCSV(index, topic.TopicName)" class="flex ">
					{{ topic.TopicName }}</topicHistoryItem>
			</div>-->
		</div>
	</div>
	<div v-else>
		<p class="text-center">Here Are The Results for Topic: {{ currentRoom.topicName }}</p>
		<voteResultNameDisplay v-for="voteObj in sortedVotes" :voteObj=voteObj>
		</voteResultNameDisplay>
		<button v-if="currentUser.permissions.host" @click="socketRevote()"
		class="px-5 py-2 m-5 hover:bg-yellow-700 text-slate-50 bg-yellow-500 rounded-lg">Revote</button>
	<button @click="socketLeaveRoom" class="px-5 py-2 m-5 hover:bg-blue-700 text-slate-50 bg-blue-500 rounded-lg">Leave
		Room</button>
	<button @click="socketNewTopic()" v-show="currentUser.permissions.host"
		class="px-5 py-2 m-5 hover:bg-orange-700 text-slate-50 bg-orange-500 rounded-lg">New Topic</button>
	<Pie :data="pieData" :options="chartOptions" />
	<Bar :data="pieData" :options="chartOptions" />
	<button @click="downloadCharts"
		class="px-5 py-2 m-5 hover:bg-gray-700 text-slate-50 bg-gray-500 rounded-lg">Download Chart PNG</button>
</div></template>
