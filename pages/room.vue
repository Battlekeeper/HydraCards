<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import HCUser from "backend/models/HCUser";
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import roomMemberDisplay from "../components/roomMemberDisplay.vue"

const route = useRouter()
const socket = io("ws://localhost:3000");
const displayName = ref("")

var roomId: string = route.currentRoute.value.query.id as string
const { data: room } = await useFetch("http://localhost:3000/api/getRoomById?id=" + roomId)

async function apiJoinRoom() {
	var response = await useFetch("/api/joinRoom?id=" + roomId, { credentials: "include" })

	// @ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function socketLeaveRoom() {
	// @ts-ignore
	socket.emit("leaveRoom", room.value?.id as Number, useCookie('_id').value as string)
	window.location.href = "/"
}

function isInRoom() {
	if (useCookie('_id').value == undefined)
	{
		return false
	}
	// @ts-ignore
	if (room.value!.members.findIndex((id) => useCookie('_id').value as string == id) == -1){
		return false
	}
	return true
}
async function apiSetDisplayName(){
	await useFetch("/api/setname?name=" + displayName.value,{credentials: "include"})
}

const roomMembers: Ref<Array<HCUser>> = ref(new Array<HCUser>)

onMounted(() => {
	socket.on("connect", () => {
		socket.emit("joinSocketRoom", Number.parseInt(roomId), useCookie('_id').value as string)
	})
	socket.on("roomMemberUpdate", (members: Array<HCUser>) => {
		roomMembers.value = members
	})
})

watch(displayName, apiSetDisplayName)

</script>
<template>
	<div v-if="isInRoom()">
		<p class="text-center">{{ room }}</p>
		<input class="border-2 border-green-500" type="text" placeholder="insert name here" v-model="displayName">
		<button @click="apiSetDisplayName()">Set name</button>
		<br>
		<roomMemberDisplay :members=roomMembers></roomMemberDisplay>
		<button @click="socketLeaveRoom">Leave Room</button>
	</div>
	<div v-else>
		<button @click="apiJoinRoom()">Join Room</button>
	</div>
</template>