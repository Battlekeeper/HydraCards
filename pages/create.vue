<script setup lang="ts">
import { useDark } from "@vueuse/core"
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";

const isDark = useDark()
const config = useRuntimeConfig()
const showCreateRoomPrompt = ref(false)
const showJoinRoomPrompt = ref(false)
const joinCode = ref("")

</script>

<template>
	<div class="h-screen dark:bg-DarkGrey">
	<PermenantHeader></PermenantHeader>
	<div class="relative top-10 left-48 text-white text-5xl font-bold">Joining a Room</div>
	<div class="relative top-10 left-48 pt- text-slate-400 text-xl font-normal">Get a code from the host and input it here.</div>
	
	<div class="w-96 h-1/2 bg-slate-700 rounded-md shadow relative left-80 top-32">
		<div class="text-center text-orange-500 text-xl font-medium relative top-16">Join Room</div>
		<div class="relative top-16 text-center text-slate-50 text-3xl font-semibold leading-9">Room Code</div>
		<div class="w-60 h-11 px-3.5 py-2.5 relative top-20 left-16 bg-white rounded-lg shadow border border-gray-300">
			<input class="grow shrink basis-0 text-slate-800 text-base font-normal leading-normal" placeholder="12345678">
		</div>

		<div class="flex relative top-1/4 left-16">
			<div class="w-5 h-5 left-0 top-0 relative bg-orange-500 rounded-full border border-orange-700">
				<p class="justify-evenly relative -top-1 flex">✓</p>
			</div>
			<div class="w-64 text-slate-300 text-base font-medium leading-normal pl-2">Join And Vote</div>
		</div>
		<div class="flex relative top-1/4 left-16 pt-4">
			<div class="w-5 h-5 left-0 top-0 relative bg-orange-500 rounded-full border border-orange-700">
				<p class="justify-evenly relative -top-1 flex">✓</p>
			</div>
			<div class="w-64 text-slate-300 text-base font-medium leading-normal pl-2">See Saved Stories</div>
		</div>
		<div class="relative -bottom-48 left-24 w-40 h-11 px-4 py-3 rounded-md shadow border border-orange-500 justify-center items-center gap-2 flex">
			<div class="text-orange-500 font-medium">
				<button @click="showJoinRoomPrompt = !showJoinRoomPrompt">
					<span>join room</span>
				</button>
			</div>
		</div>
		</div>
		
		<div class="w-96 h-1/2 bg-slate-700 rounded-md shadow absolute right-80 top-64">
			<div class="text-center text-orange-500 text-xl font-medium relative top-16">Host Temporary Room</div>
			<div class="w-60 h-11 px-3.5 py-2.5 relative top-20 left-16 bg-white rounded-lg shadow border border-gray-300">
				<input class="grow shrink basis-0 text-slate-800 text-base font-normal leading-normal" placeholder="12345678">
			</div>

			<div class="flex relative top-1/4 left-16">
				<div class="w-5 h-5 left-0 top-0 relative bg-orange-500 rounded-full border border-orange-700">
					<p class="justify-evenly relative -top-1 flex">✓</p>
				</div>
				<div class="w-64 text-slate-300 text-base font-medium leading-normal pl-2">Edit Story Names</div>
			</div>
			<div class="flex relative top-1/4 left-16 pt-4">
				<div class="w-5 h-5 left-0 top-0 relative bg-orange-500 rounded-full border border-orange-700">
					<p class="justify-evenly relative -top-1 flex">✓</p>
				</div>
				<div class="w-64 text-slate-300 text-base font-medium leading-normal pl-2">Moderator Tools</div>
			</div>
			<div class="relative -bottom-48 left-24 w-40 h-11 px-4 py-3 rounded-md shadow border border-orange-500 justify-center items-center gap-2 flex">
				<div class="text-orange-500 font-medium">
					<button @click="showCreateRoomPrompt = !showCreateRoomPrompt">
						<span>Create room</span>
					</button>
				</div>
			</div>
		</div>
	</div>


		<!--<div class="absolute right-80">
		<div class="w-96 h-96 bg-slate-700 rounded-md shadow">
			<div class="w-72 text-center text-green-500 text-xl font-medium leading-loose">Host Temporary Room</div>
			<div class="w-24 h-24 relative"></div>
			<div class="w-5 h-5 relative">
  				<div class="w-5 h-5 left-0 top-0 absolute rounded-3xl shadow">
    				<div class="w-5 h-5 left-0 top-0 absolute bg-orange-500 rounded-full border border-orange-900"></div>
  				</div>
  			<div class="w-5 h-5 left-0 top-0 absolute"></div>
			  <div class="w-64 text-slate-500 text-base font-medium leading-normal">Edit Story Names</div>
			  <div class="w-5 h-5 relative">
  		<div class="w-5 h-5 left-0 top-0 absolute rounded-3xl shadow">
    		<div class="w-5 h-5 left-0 top-0 absolute bg-orange-500 rounded-full border border-orange-900"></div>
  				</div>
  			<div class="w-5 h-5 left-0 top-0 absolute"></div>
		</div>
		<div class="w-64 text-slate-500 text-base font-medium leading-normal">Moderator Tools</div>
		<div class="w-72 h-11 px-4 py-3 bg-orange-500 rounded-md shadow justify-center items-center gap-2 inline-flex text-orange-50 text-base font-medium leading-normal">
			<button @click="showCreateRoomPrompt = !showCreateRoomPrompt" class="w-28 h-9">
				<span>create room</span>
			</button>
		</div>
		</div>	
		</div>->
	</div>
	</div>


		
			<div v-show="showComponent" @click="showComponent = false">
				<ModalPopup><namePrompt size="600" :pagelink="true" ></namePrompt></ModalPopup>
			</div>-->
			<div v-show="showCreateRoomPrompt">
				<ModalPopup><CreateRoomPrompt size="800" :pagelink="true" ></CreateRoomPrompt></ModalPopup>
			</div>
			<div v-show="showJoinRoomPrompt">
				<ModalPopup><JoinRoomPrompt size="600" :pagelink="true" ></JoinRoomPrompt></ModalPopup>
			</div>
			
	
	<!--<button @click="showComponent = true" class="bg-blue-500 hover:bg-blue-600">Create Room </button>-->
	  
	  <!--<a href="/join">Join Room</a>  apiCreateRoom(); at creat-->
	
	
  </template>