<script setup lang="ts">
import { useDark } from "@vueuse/core"

const isDark = useDark()
const showCreateRoomPrompt = ref(false)
const showJoinRoomPrompt = ref(false)

</script>

<template>
	<div class="h-full dark:bg-DarkGrey">
	<PermenantHeader></PermenantHeader>
	<div class="relative top-10 left-48  text-black dark:text-slate-50 text-5xl font-bold">Joining a Room</div>
	<div class="relative top-10 left-48 pt-3 text-black dark:text-slate-400 text-xl font-normal">Get a code from the host and input it here.</div>
	<div class="flex place-content-evenly flex-wrap">
		<div class="flex place-content-start pt-20 pl-40 h-screen">
		<div class="w-96 h-2/3 bg-gray-300 dark:bg-slate-700 rounded-md shadow">
			<div class="text-center text-blue-800 dark:text-orange-500 text-xl font-medium relative top-16">Join Room</div>
			<div class="relative top-16 text-center text-black dark:text-slate-500 text-3xl font-semibold pt-2 pb-4">Room Code</div>
			<div class="w-60 h-11 px-3.5 py-2.5 relative top-20 left-16 bg-slate-50 rounded-lg shadow border border-gray-300">
				<input text="number" class="grow shrink basis-0 text-slate-800 text-base font-normal" placeholder="12345678">
			</div>

			<div class="flex relative top-1/4 left-16">
				<div class="w-5 h-5 left-0 top-0 relative bg-blue-800 dark:bg-orange-500 rounded-full border border-blue-950 dark:border-orange-700">
					<p class="justify-evenly relative -top-1 flex">✓</p>
				</div>
				<div class="w-64 text-black dark:text-slate-500 text-base font-medium pl-2">Join And Vote</div>
			</div>
			<div class="flex relative top-1/4 left-16 pt-4">
				<div class="w-5 h-5 left-0 top-0 relative bg-blue-800 dark:bg-orange-500 rounded-full border border-blue-950 dark:border-orange-700">
					<p class="justify-evenly relative -top-1 flex">✓</p>
				</div>
				<div class="w-64 text-black dark:text-slate-500 text-base font-medium leading-normal pl-2">See Saved Stories</div>
			</div>
			<div class="relative -bottom-48 left-24 w-40 h-11 px-4 py-3 rounded-md shadow border border-blue-800 dark:border-orange-500 hover:bg-blue-800 dark:hover:bg-orange-500 justify-center items-center gap-2 flex">
				<div class="text-blue-800 dark:text-orange-500 hover:text-slate-50 dark:hover:text-slate-50 font-medium">
					<button @click="showJoinRoomPrompt = !showJoinRoomPrompt">
						<span>Join room</span>
					</button>
				</div>
			</div>
			</div>
		</div>
			
		<div class="flex place-content-end lg:pt-20 lg:pr-40">
			<div class="w-96 h-2/3 bg-gray-300 dark:bg-slate-700 rounded-md shadow">
				<div class="text-center text-blue-800 dark:text-orange-500 text-xl font-medium relative top-16">Host Temporary Room</div>
				<div>
					<img v-show="isDark" src="@/images/server_icon_slate-50.png" style="width: 100px; height: 100px" class="relative left-32 top-24">
					<img  v-show="!isDark"  src="@/images/server_icon_black.png" style="width: 100px; height: 100px" class="relative left-32 top-24">
				</div>

				<div class="flex relative top-1/4 left-16">
					<div class="w-5 h-5 left-0 top-0 relative bg-blue-800 dark:bg-orange-500 rounded-full border border-blue-950 dark:border-orange-700">
						<p class="justify-evenly relative -top-1 flex">✓</p>
					</div>
					<div class="w-64 text-black dark:text-slate-500 text-base font-medium leading-normal pl-2">Edit Story Names</div>
				</div>
				<div class="flex relative top-1/4 left-16 pt-4">
					<div class="w-5 h-5 left-0 top-0 relative bg-blue-800 dark:bg-orange-500 rounded-full border border-blue-950 dark:border-orange-700">
						<p class="justify-evenly relative -top-1 flex">✓</p>
					</div>
					<div class="w-64 text-black dark:text-slate-500 text-base font-medium leading-normal pl-2">Moderator Tools</div>
				</div>
				<div class="relative -bottom-48 left-24 w-40 h-11 px-4 py-3 rounded-md shadow border border-blue-800 dark:border-orange-500 hover:bg-blue-800 dark:hover:bg-orange-500 justify-center items-center gap-2 flex">
					<div class="text-blue-800 dark:text-orange-500 hover:text-slate-50 dark:hover:text-slate-50 font-medium">
						<button @click="showCreateRoomPrompt = !showCreateRoomPrompt">
							<span>Create room</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
		<div v-show="showCreateRoomPrompt">
			<ModalPopup><CreateRoomPrompt size="800" :pagelink="true" ></CreateRoomPrompt></ModalPopup>
		</div>
		<div v-show="showJoinRoomPrompt">
			<ModalPopup><JoinRoomPrompt size="600" :pagelink="true" ></JoinRoomPrompt></ModalPopup>
		</div>
	
  </template>