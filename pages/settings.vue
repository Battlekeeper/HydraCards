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
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.baseUrl })
const { data: room } = await useFetch(`api/room/getRoomById?id=` + route.query.id, { baseURL: config.public.baseUrl })
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

	var voters = historicalVote.Revotes[historicalVote.Revotes.length - 1]
	if (voters != undefined){
		story.numberOfVoters =Object.keys(voters).length
	}
	
	stories.value.push(story)
})
stories.value.pop()

const displayName = ref(currentUser.value.displayName)
const timerEnabled = ref(currentRoom.value.roomCounterEnabled)
const timerMinutes = ref(Math.floor(currentRoom.value.counter.default / 60))
const timerSeconds = ref(currentRoom.value.counter.default % 60)

const allowAnonymous = ref(currentRoom.value.allowAnonymousMode)
const anonymousMode = ref(currentUser.value.anonymous)

async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, { credentials: "include", baseURL: config.public.baseUrl })
}
async function apiSetTimer() {
	await useFetch(`api/room/setTimerActive` , { query:{
		id: currentRoom.value.id,
		enabled: timerEnabled.value,
		count: timerMinutes.value * 60 + timerSeconds.value
	}, credentials: "include", baseURL: config.public.baseUrl, keepalive: false })
}

watch(timerEnabled, apiSetTimer);
onUnmounted(apiSetTimer)

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

async function exportStory(topicIndex: number, topicName: string): Promise<void> {
	var response = await useFetch(`api/room/csv`, { 
		baseURL: config.public.baseUrl, 
		query: { 
			id: currentRoom.value.id, 
			topic: topicIndex, 
		} 
	})

	const blob = new Blob([response.data.value as any], { type: 'text/csv' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = topicName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function isRoomHistoryEmpty(): boolean {
	return currentRoom.value.history == undefined 
		|| currentRoom.value.history.length == 0
		|| stories.value == undefined 
		|| stories.value.length == 0
}

async function exportAllStories() {
	if (isRoomHistoryEmpty()) {
		return;
	}

	var response = await useFetch(`api/room/csv`, { 
		baseURL: config.public.baseUrl, 
		query: { 
			id: currentRoom.value.id, 
		} 
	})

	const blob = new Blob([response.data.value as any], { type: 'text/csv' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `room_${currentRoom.value.id}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
</script>

<template>
	<div class="flex flex-col items-center" style="max-height: 100svh; max-width: 100svw; overflow-x: hidden;">
		<div class="w-full">
			<PermenantHeader :inRoom="true" :inSettings="true"></PermenantHeader>
		</div>
		<h1 class="text-center text-black dark:text-gray-50 text-6xl font-bold mb-8">Settings</h1>
		<div class="flex flex-col-reverse lg:flex-row gap-16 h-full" >
			<div class="flex flex-col grow bg-gray-300 dark:bg-gray-700 rounded-xl lg:min-w-[550px]">
				<div class="grid grid-cols-1">
					<div class="grid grid-cols-5 p-4 items-center">
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap">Story Name</p>
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap">Points</p>
						<p class="font-semibold text-black dark:text-gray-400 whitespace-nowrap grow"># Of Voters</p>
						<button v-if="!isRoomHistoryEmpty()" @click="exportAllStories" class="dark:bg-orange-500 bg-blue-800 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[160px]">Export All To CSV</button>
						<button v-if="!isRoomHistoryEmpty()" @click="deleteAllStories" class="dark:bg-orange-500 bg-blue-800 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
						<p v-if="isRoomHistoryEmpty()" class="font-semibold text-black dark:text-gray-400 whitespace-nowrap grow">Export</p>
					</div>
					<div class="border-gray-400 border-b-2"></div>
					<div class="min-h-[48px]">
						<div class="grid grid-cols-5 p-4 items-center" v-for="(story, index) in stories">
							<p class="font-semibold text-gray-400 whitespace-nowrap">{{story.name}}</p>
							<p class="font-semibold text-gray-400 whitespace-nowrap">{{story.points}}</p>
							<p class="font-semibold text-gray-400 whitespace-nowrap grow">{{story.numberOfVoters}}</p>
							<button @click="exportStory(index,story.name)" class="bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[160px]">Export To CSV</button>
							<button @click="deleteStory(index,story.name)" class="bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium w-[35px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>

						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col justify-center items-center gap-6">
				<div v-if="currentUser.permissions.host" class="dark:bg-gray-700 max-sm:w-3/4 bg-gray-300 rounded-md p-4 w-full" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Timed Room</h1>
						<Toggle v-model="timerEnabled" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium">Change whether players must submit their
						answers by a certain time.
					</p>
					<div v-if="timerEnabled" class="gap-8 flex justify-center pt-2">
						<div class="dark:text-slate-300 text-black text-sm font-bold leading-tight">MINS</div>
						<div class="dark:text-slate-300 text-black text-sm font-bold leading-tight">SECS</div>
					</div>
					<div v-if="timerEnabled" class="bg-gray-300 dark:bg-gray-700 rounded-2xl flex justify-center pt-2 pb-2">
						<input v-model="timerMinutes" type="number" class="w-12 h-12 text-center bg-white dark:bg-slate-800 text-black dark:text-white text-2xl font-normal rounded-md pl-2 pr-2" placeholder="00">
						<p class="w-fit h-fit text-[30px] pl-2 pr-2">:</p>
						<input v-model="timerSeconds" type="number" class="w-12 h-12 text-center bg-white dark:bg-slate-800 text-black dark:text-white text-2xl font-normal rounded-md pl-2 pr-2" placeholder="00">
					</div>
				</div>
                <div v-if="currentUser.permissions.host" class="dark:bg-gray-700 max-sm:w-3/4 bg-gray-300 rounded-md p-4 w-full" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Allow Anonymous</h1>
						<Toggle v-model="allowAnonymous" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium pr-8">Allow players to use anonymous mode or not.</p>
				</div>
                <div v-if="currentRoom.allowAnonymousMode" class="dark:bg-gray-700 max-sm:w-3/4 bg-gray-300 rounded-md p-4 w-full" style="aspect-ratio: 1.5/0.39944134078;">
					<div class="flex justify-between">
						<h1 class="text-white-900 text-xl font-bold mb-4">Anonymous Mode</h1>
						<Toggle v-model="anonymousMode" class="mr-4"/>
					</div>
					<p class="grow-1 text-black dark:text-slate-400 text-base font-medium  pr-8">Allow other people to see your name or not.</p>
				</div>
			</div>
		</div>
	</div>
</template>