<script setup lang="ts">
import { ref } from "vue"
const route = useRoute()

const joinCode = ref("")
const showRoom404Message = ref(false)
const config = useRuntimeConfig()

async function apiJoinRoom() {
	var response = await useFetch("api/room/joinRoom?id=" + joinCode.value, { credentials: "include", baseURL:  config.public.baseUrl})

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
	<p class="text-black text-center">Join Room</p>
	<input class="text-center border-2 border-green-600" placeholder="Enter room code" type="text" v-model="joinCode">
	<button @click="apiJoinRoom">
		<p class="text-center text-5xl text-rose-400 font-mono">Join</p>
	</button>
	<ErrorMessage v-show="showRoom404Message">That room does not exist</ErrorMessage>
</template>