<script setup lang="ts">
import { useDark } from "@vueuse/core"
const isDark = useDark()
const config = useRuntimeConfig()

async function apiCreateRoom() {
	var response = await useFetch("api/room/createRoom", { credentials: "include", baseURL: config.public.baseUrl })
	//@ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	window.location.href = "/name?id=" + room.id
}
</script>

<template>
	<div class="h-screen dark:bg-DarkGrey">
	  <p class="text-black text-center">Create Room</p>
	  <button @click="apiCreateRoom" class="text-center text-5xl text-rose-400 font-mono">
		<p class="text-center text-5xl text-rose-400 font-mono">Create This Room</p>
		<div class="flex flex-row justify-between m-10 absolute w-1/2" style="left: 50%; top:50%; transform: translate(-50%, -50%);">
		</div>
	
	  </button>
	  <a class="text-5xl text-rose-400 font-mono" href="/join">Join Room</a>
	</div>
  </template>