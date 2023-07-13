<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import ErrorMessage from "../components/errorMessage.vue";

const joinCode = ref("")
const showRoom404Message = ref(false)

onMounted(() => {
});

async function apiCreateRoom() {
	var response = await useFetch("/api/room/createRoom", { credentials: "include" })
	//@ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/room?id=" + room.id
}
async function apiJoinRoom() {
	var response = await useFetch("/api/room/joinRoom?id=" + joinCode.value, { credentials: "include" })

	// @ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	if (room == undefined) {
		showRoom404Message.value = true
	} else {
		//router.push({ path: 'room', query: { id: room.id } })
		//TODO: Find a way to have router.push not be shallow redirect
		window.location.href = "/room?id=" + room.id
	}
}

</script>
<template>
	<p class="text-7xl text-cyan-700 font-medium text-center italic">Welcome!</p>
	<div class="flex flex-row justify-between m-10 absolute w-1/2" style="left: 50%; top:50%; transform: translate(-50%, -50%);">
		<button @click="apiCreateRoom">
			<p class="text-5xl text-rose-400 font-mono">Create Room</p>
		</button>
		<div>
			<button @click="apiJoinRoom">
				<p class="text-5xl text-rose-400 font-mono">Join</p>
			</button>
			<input class="border-2 border-green-600 " type="text" v-model="joinCode">
			<ErrorMessage v-show="showRoom404Message">That room does not exist</ErrorMessage>
		</div>
	</div>
</template>
