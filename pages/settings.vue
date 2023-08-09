<script setup lang="ts">
import HCUser from "../backend/models/HCUser";
import HCRoom from "../backend/models/HCRoom";

import Toggle from '@vueform/toggle'
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const route = useRoute()


const userId: Ref<string> = ref(useCookie('_id').value as string)
const config = useRuntimeConfig()
const name = ref(null)
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.serverUrl })
const { data: room } = await useFetch(`api/room/getRoomById?id=` + route.query.id, { baseURL: config.public.serverUrl })
currentRoom.value = room.value as HCRoom
currentUser.value = user.value as HCUser

const stories = ref([{name:"",points:0, numberOfVoters: 0}])
stories.value.pop()
currentRoom.value.history.forEach((historicalVote) => {
	var story = {name:"",points:0, numberOfVoters: 0}
	story.name = historicalVote.TopicName
	if (story.name == "" || story.name == undefined){
		story.name = "Unnamed"
	}
	story.points = historicalVote.Points
	story.numberOfVoters = historicalVote.Revotes.length
	stories.value.push(story)
})
stories.value.pop()

const displayName = ref(currentUser.value.displayName)
const timerEnabled =  ref(currentRoom.value.roomCounterEnabled)

const allowAnonymous = ref(currentRoom.value.allowAnonymousMode)
const anonymousMode = ref(currentUser.value.anonymous)

async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, { credentials: "include", baseURL: config.public.baseUrl })
}

watch(timerEnabled, async ()=>{
	await useFetch(`api/room/setTimerActive` , { query:{
		id: currentRoom.value.id,
		enabled: timerEnabled.value
	}, credentials: "include", baseURL: config.public.baseUrl })
})
watch(allowAnonymous, async ()=>{
	currentRoom.value.allowAnonymousMode = allowAnonymous.value
	await useFetch(`api/room/allowAnonymous` , { query:{
		id: currentRoom.value.id,
		enabled: allowAnonymous.value
	}, credentials: "include", baseURL: config.public.baseUrl })
})
watch(anonymousMode, async ()=>{
	await useFetch(`api/user/setAnonymousMode` , { query:{
		id: currentUser.value.id,
		enabled: anonymousMode.value
	}, credentials: "include", baseURL: config.public.baseUrl })
})

</script>

<template>
	<div class="flex flex-col items-center" style="max-height: 100svh; max-width: 100svw; overflow-x: hidden;">
		<div class="w-full">
			<PermenantHeader :inRoom="true" :inSettings="true"></PermenantHeader>
		</div>
		<h1 class="text-center text-black dark:text-gray-50 text-6xl font-bold mb-8">Settings</h1>
		<div class="flex gap-16 h-full" >
			<div class="flex flex-col grow-[3] bg-gray-300 dark:bg-gray-700 rounded-xl">
				<div class="grid grid-cols-1">
					<div class="grid grid-cols-4 p-4 items-center">
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap">Story Name</p>
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap">Points</p>
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap grow"># Of Voters</p>
						<button class="dark:bg-orange-500 bg-blue-800 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[160px]">Export All To CSV</button>
					</div>
					<div class="border-gray-400 border-b-2"></div>
					<div  class="grid grid-cols-4 p-4 items-center" v-for="story in stories">
						<p class="font-semibold text-gray-400 whitespace-nowrap">{{story.name}}</p>
						<p class="font-semibold text-gray-400 whitespace-nowrap">{{story.points}}</p>
						<p class="font-semibold text-gray-400 whitespace-nowrap grow">{{story.numberOfVoters}}</p>
						<button class="bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[160px]">Export To CSV</button>
					</div>
				</div>
			</div>
			<div class="flex flex-col grow-1">
				<div v-if="currentUser.permissions.host" class="dark:bg-gray-700 bg-gray-300 rounded-md p-4" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Timed Room</h1>
						<Toggle v-model="timerEnabled" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium">Change whether players must submit their
						answers by a certain time.</p>
				</div>
                <div v-if="currentUser.permissions.host" class="dark:bg-gray-700 bg-gray-300 rounded-md p-4 mt-6" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Allow Anonymous</h1>
						<Toggle v-model="allowAnonymous" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium pr-8">Allow players to use anonymous mode or not.</p>
				</div>
                <div v-if="currentRoom.allowAnonymousMode" class="dark:bg-gray-700 bg-gray-300 rounded-md p-4 mt-6" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Anonymous Mode</h1>
						<Toggle v-model="anonymousMode" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium  pr-8">Allow other people to see your name or not.</p>
				</div>
                <div class="dark:bg-gray-700 bg-gray-300 rounded-md p-4 mt-6" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between flex-col">
						<h1 class="text-white-900 text-xl font-bold">Nickname</h1>
                        <div class="flex-row">
                            <input v-model="displayName" text="text" class="w-80 mt-4 mr-2 bg-white dark:bg-gray-300 font-normal p-2 rounded-md text-black"
				            placeholder="Enter Your Name">
                        	<button @click="apiSetDisplayName()" class="bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium">Set Name</button>
                        </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>