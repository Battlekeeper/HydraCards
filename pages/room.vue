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
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const currentRoomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)
const userId: Ref<string> = ref(useCookie('_id').value as string)
var roomId: string = route.currentRoute.value.query.id as string

const { data: room } = await useFetch(`api/room/getRoomById?id=` + roomId, {baseURL: config.public.serverUrl})
currentRoom.value = room.value as HCRoom

var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
pieData.value.labels = votes.keys()
pieData.value.datasets[0].data = votes.values()


const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, {baseURL: config.public.serverUrl})
currentUser.value = user.value as HCUser
displayName.value = currentUser.value.displayName

async function apiJoinRoom() {
	var response = await useFetch(`api/room/joinRoom?id=` + roomId, {credentials: "include", baseURL: config.public.baseUrl})

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
	socket.emit("revote", Number.parseInt(roomId), userId.value)
}
function isInRoom() {
	if (userId.value == undefined) {
		return false
	}
	// @ts-ignore
	if (currentRoom.value!.members.findIndex((id) => userId.value == id) == -1) {
		return false
	}
	return true
}
async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, {credentials: "include", baseURL: config.public.baseUrl})
}
function socketSetName(){
	socket.emit("setMemberName", currentRoom.value.id, currentUser.value.id, displayName.value)
}
function submitVote(vote: number) {
	socket.emit("submitVote", Number.parseInt(roomId), userId.value, vote)
}
function setCardActive(cardId: number) {
	selectedCard.value = cardId
}
async function switchSpectatorMode(mode: boolean) {
	await useFetch(`api/user/setSpectatorMode?mode=` + mode, {baseURL: config.public.baseUrl})
	selectedCard.value = -1
}
function getRoomVotesMap(room: HCRoom) {
	
	var votes: TSMap<string, number> = new TSMap<string, number>

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
function socketSetTopicName(){
	socket.emit("setRoomTopicName", currentRoom.value.id, currentUser.value.id, roomTopicName.value)
	
}
function socketStartCount(){
	socket.emit("startCount", currentRoom.value.id, currentUser.value.id, countDownTime.value)
}
function copy(){
	const url = window.location.href
	navigator.clipboard.writeText(url)
}
async function uploadProfile(event:any){
	const formData = new FormData();
  	formData.append('profileImage', event.srcElement.files[0]);
	await fetch("api/user/profileupload", {method: "POST", body: formData})
}
function click(){
	//@ts-ignore
	document.getElementById('fileInput').click()
}

onMounted(async () => {
	socket.on("connect", () => {
		socket.emit("joinSocketRoom", Number.parseInt(roomId), userId.value as string)
	})
	socket.on("roomStateUpdate", (room: HCRoom, members: Array<HCUser>) => {
		currentRoom.value = room
		currentRoomMembers.value = members;
		currentUser.value = currentRoomMembers.value.find(member => member.id == userId.value) as HCUser

		var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)

		pieData.value.labels = votes.keys()
		pieData.value.datasets[0].data = votes.values()
	})
})

definePageMeta({
  middleware: ["nullroomredirect"]
})

watch(displayName, socketSetName)

</script>

<template>
	<div v-if="isInRoom()">
		<div>
			<button @click="copy()" class="my-4">
				<span class="px-2 py-2 m-2 hover:bg-gray-700 text-white bg-gray-500 rounded-lg text-sm">Copy URL</span>
			</button>
			<input hidden id="fileInput"  @change="uploadProfile($event)" type="file" accept="image/*">
			<button @click="click">
				<span class="px-2 py-2 m-2 hover:bg-gray-700 text-white bg-gray-500 rounded-lg text-sm">Upload Profile Image</span>
			</button>
		</div>
		<div v-if="currentRoom.status == HCRoomStatus.voting">
			<div class="flex flex-col items-center justify-center">
				<input type="text" v-show="currentUser.permissions.host" placeholder="Insert topic title" v-model="roomTopicName" class="h-20 text-4xl text-center"/>
				<button class="place-content-center px-3 py-1 m-1 hover:bg-green-700 text-white bg-green-500 rounded-lg text-sm" v-show="currentUser.permissions.host" @click="socketSetTopicName()">Set Title</button>
				<h1 v-show="currentRoom.topicName != '' && !currentUser.permissions.host" class="text-4xl md:text-5xl text-center">{{ currentRoom.topicName }}</h1>
			</div>
			<div v-if="!currentRoom.counter.active && currentUser.permissions.host">
				<input type="text" placeholder="Countdown in seconds" v-model="countDownTime" class="border-2 border-black">
				<button @click="socketStartCount" class="px-3 py-1 m-1 hover:bg-yellow-700 text-white bg-yellow-500 rounded-lg text-sm">Start Countdown</button>
			</div>
			<h1 v-if="currentRoom.counter.active">{{currentRoom.counter.count}} seconds left to vote</h1>
			<input class="border-2 border-green-500" type="text" placeholder="insert name here" v-model="displayName">
			<button @click="socketSetName" class="px-3 py-1 m-1 hover:bg-purple-700 text-white bg-purple-500 rounded-lg text-sm">Set name</button>
			<br>
			<div v-for="member in  currentRoomMembers">
				<roomMemberDisplayItem :member=member></roomMemberDisplayItem>
			</div>
			<button @click="socketLeaveRoom"
				class="px-5 py-2 m-5 hover:bg-blue-700 text-white bg-blue-500 rounded-lg text-lg">Leave
				Room</button>
			<button v-show="currentUser.permissions.host" @click="socketDisplayResults"
				class="px-5 py-2 m-5 hover:bg-indigo-700 text-white bg-indigo-500 rounded-lg text-lg">Display Results</button>
			<button v-if="currentUser.userVotingStatus != 1" @click="switchSpectatorMode(true)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg text-lg">Switch to spectator
				mode</button>
			<button v-else @click="switchSpectatorMode(false)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg">Switch to voting mode</button>
			<div>
				<voteCard v-for="card in cards" :cardId=card :userVotingStatus=currentUser.userVotingStatus
					:selectedCard=selectedCard @click="submitVote(card); setCardActive(card)">{{ card }}</voteCard>
			</div>
			
			<p class="text-center text-xs">{{ currentRoom }}</p>
		</div>
		<div v-else>
			<p class="text-center">Here Are The Results for Topic: {{ currentRoom.topicName }}</p>
			<voteResultNameDisplay v-for="(vote, userId) in currentRoom.votes" :vote=vote :userId=userId>
			</voteResultNameDisplay> 
			<button v-if="currentUser.permissions.host" @click="socketRevote()"
				class="px-5 py-2 m-5 hover:bg-yellow-700 text-white bg-yellow-500 rounded-lg">Revote</button>
			<button @click="socketLeaveRoom"
				class="px-5 py-2 m-5 hover:bg-blue-700 text-white bg-blue-500 rounded-lg">Leave
			Room</button>
			<Pie :data="pieData" :options="chartOptions" />
			<Bar :data="pieData" :options="chartOptions" />
		</div>
	</div>
	<div v-else>
		<button @click="apiJoinRoom" class="px-5 py-2 m-5 hover:bg-orange-700 text-white bg-orange-500 rounded-lg">Join
			Room</button>
	</div>
</template>