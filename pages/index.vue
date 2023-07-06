<script setup lang="ts">
import { HCRoom, HCUser } from "server/plugins/rooms"
import { ref } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()
const joinCode = ref("")

async function apiCreateRoom(){
	var response = await useFetch("/api/createRoom")
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
	let user:HCUser = response.data.value?.user as unknown as HCUser
	localStorage.setItem("HCActiveUser", JSON.stringify(user));
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function apiJoinRoom(){
	var response = await useFetch("/api/joinRoom?id=" + joinCode.value)
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
	let user:HCUser = response.data.value?.user as unknown as HCUser
	localStorage.setItem("HCActiveUser", JSON.stringify(user));
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}

</script>
<template>
	<p class="text-center">Welcome!</p>
	<button @click="apiCreateRoom()">Create Room</button>
	<div class="flex">
		<input class="border-2 border-red-500" type="text" v-model="joinCode">
		<button @click="apiJoinRoom">Join</button>
	</div>
</template>