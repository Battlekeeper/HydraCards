<script setup lang="ts">
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
	<p class="text-black text-center">Create Room</p>
	<button @click="apiCreateRoom">
		<p class="text-center text-5xl text-rose-400 font-mono">Create This Room</p>
	</button>
</template>