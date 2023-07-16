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


const route = useRouter()
const socket = io("ws://localhost:3000");
const displayName = ref("")
const cards = ref([0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100])
const selectedCard = ref(-1)
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const currentRoomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)
const cardSelectionEnabled = ref(true);

const userId: Ref<string> = ref(useCookie('_id').value as string)


var roomId: string = route.currentRoute.value.query.id as string
const { data: room } = await useFetch("http://localhost:3000/api/room/getRoomById?id=" + roomId)
currentRoom.value = room.value as HCRoom


var votes: TSMap<string, number> = getRoomVotesMap(currentRoom.value)
pieData.value.labels = votes.keys()
pieData.value.datasets[0].data = votes.values()


const { data: user } = await useFetch("http://localhost:3000/api/user/getUserById?id=" + userId.value)
currentUser.value = user.value as HCUser

async function apiJoinRoom() {
	var response = await useFetch("/api/room/joinRoom?id=" + roomId, { credentials: "include" })

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
	await useFetch("/api/user/setname?name=" + displayName.value, { credentials: "include" })
}
function submitVote(vote: number) {
	socket.emit("submitVote", Number.parseInt(roomId), userId.value, vote)
}
function setCardActive(cardId: number) {
	selectedCard.value = cardId
}
async function switchSpectatorMode(mode: boolean) {
	await useFetch("http://localhost:3000/api/user/setSpectatorMode?mode=" + mode)
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
	return votes
}


onMounted(() => {
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

watch(displayName, apiSetDisplayName)
</script>

<template>
	<div v-if="isInRoom()">
		<div v-if="currentRoom.status == HCRoomStatus.voting">
			<p class="text-center">{{ room }}</p>
			<input class="border-2 border-green-500" type="text" placeholder="insert name here" v-model="displayName">
			<button @click="apiSetDisplayName">Set name</button>
			<br>
			<div v-for="member in  currentRoomMembers">
				<roomMemberDisplayItem :member=member></roomMemberDisplayItem>
			</div>
			<button @click="socketLeaveRoom"
				class="px-5 py-2 m-5 hover:bg-blue-700 text-white bg-blue-500 rounded-lg">Leave
				Room</button>
			<button v-show="currentUser.permissions.host" @click="socketDisplayResults"
				class="px-5 py-2 m-5 hover:bg-indigo-700 text-white bg-indigo-500 rounded-lg">Display Results</button>
			<button v-if="currentUser.userVotingStatus != 1" @click="switchSpectatorMode(true)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg">Switch to spectator
				mode</button>
			<button v-else @click="switchSpectatorMode(false)"
				class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg">Switch to voting mode</button>
			<div>

			</div>
			<div>
				<voteCard v-for="card in cards" :cardId=card :userVotingStatus=currentUser.userVotingStatus
					:selectedCard=selectedCard @click="submitVote(card); setCardActive(card)">{{ card }}</voteCard>
			</div>
		</div>
		<div v-else>
			<p class="text-center">Here Are The Results:</p>
			<voteResultNameDisplay v-for="(vote, userId) in currentRoom.votes" :vote=vote :userId=userId>
			</voteResultNameDisplay>
			<button v-if="currentUser.permissions.host" @click="socketRevote()"
				class="px-5 py-2 m-5 hover:bg-yellow-700 text-white bg-yellow-500 rounded-lg">Revote</button>
			<Pie :data="pieData" :options="chartOptions" />
			<Bar :data="pieData" :options="chartOptions" />
		</div>
	</div>
	<div v-else>
		<button @click="apiJoinRoom" class="px-5 py-2 m-5 hover:bg-orange-700 text-white bg-orange-500 rounded-lg">Join
			Room</button>
	</div>
</template>