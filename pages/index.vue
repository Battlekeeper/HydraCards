<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";

const joinCode = ref("")

onMounted(()=> {
});

async function apiCreateRoom(){
	var response = await useFetch("/api/room/createRoom", { credentials: "include"})
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function apiJoinRoom(){
	var response = await useFetch("/api/joinRoom?id=" + joinCode.value, { credentials: "include"})
	
	// @ts-ignore
	let room:HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}

</script>
<template>
	<p class="text-center">Welcome!</p>
	<button @click="apiCreateRoom">Create Room</button>
	<div class="flex">
		<input class="border-2 border-red-500" type="text" v-model="joinCode">
		<button @click="apiJoinRoom">Join</button>
	</div>
</template>