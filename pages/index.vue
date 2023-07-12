<script setup lang="ts">
import { io } from "socket.io-client"
import HCRoom from "backend/models/HCRoom";
import HCUser from "backend/models/HCUser";

const joinCode = ref("")

onMounted(()=> {
	const url = useRuntimeConfig().public.socketUrl || window.location.origin;
	const socket = io(url);
	socket.on("connect",() => {
		console.log("Client Side Connected")
	});
});

async function apiCreateRoom(){
	var response = await useFetch("/api/createRoom", { credentials: "include"})
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function apiJoinRoom(){
	var response = await useFetch("/api/joinRoom?id=" + joinCode.value, { credentials: "include"})
	
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
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
		<button @click="apiJoinRoom()">Join</button>
	</div>
</template>