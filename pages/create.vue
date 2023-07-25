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
	<PermenantHeader></PermenantHeader>
	<div class="w-96 text-white text-5xl font-bold leading-10">Joining a Room</div>
	<div class="w-96 text-slate-400 text-xl font-normal leading-loose">Get a code from the host and input it here.</div>
	<div class="w-96 h-96 pb-96 bg-slate-800 justify-center items-center inline-flex">
  		<div class="w-96 h-20 relative flex-col justify-start items-start flex">
    		<div class="w-48 h-8 relative">
      			<div class="w-24 h-8 left-0 top-0 absolute">
        			<div class="origin-top-left rotate-45 w-6 h-8 left-[16px] top-[-6.63px] absolute">
        			</div>
      			</div>
			</div>
  		</div>
	</div>
		<div class="w-72 text-center text-green-500 text-xl font-medium leading-loose">Join Room</div>
		<div class="w-48 text-center text-white text-3xl font-semibold leading-9">Room Code</div>
		<div class="w-60 h-11 px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center gap-2 inline-flex">
  			<div class="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
    			<div class="grow shrink basis-0 text-slate-800 text-base font-normal leading-normal">12345678</div>
  			</div>
		</div>
	<div class="w-52 text-slate-800 text-base font-normal leading-normal">12345678</div>

	<button @click="apiCreateRoom">
		<p >Create Room</p>
		<div class="flex flex-row justify-between m-10 absolute w-1/2" style="left: 50%; top:50%; transform: translate(-50%, -50%);">
		</div>
	
	  </button>
	  <a href="/join">Join Room</a>
	</div>
  </template>