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

const stories = ref([{name: "", points: 0, numberOfVoters: 0, url: ""}])
stories.value.pop()
currentRoom.value.history.forEach((historicalVote) => {
	var story = {name: "", points: 0, numberOfVoters: 0, url: ""}
	story.name = historicalVote.TopicName
	if (story.name == "" || story.name == undefined){
		story.name = "Unnamed"
	}
	story.points = historicalVote.Points

	var voters = historicalVote.Revotes[historicalVote.Revotes.length - 1]
	if (voters != undefined){
		story.numberOfVoters =Object.keys(voters).length
	}

	story.url = historicalVote.URL
	
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
async function deleteAllStories() {
	stories.value = []
	await useFetch(`api/room/delete`, {
		baseURL: config.public.baseUrl,
		query: {
			id: currentRoom.value.id
		}
	})
}
async function deleteStory(topicIndex: number) {
	if (topicIndex > -1) {
		stories.value.splice(topicIndex, 1)
	}
	await useFetch(`api/room/delete`, { 
		baseURL: config.public.baseUrl, 
		query: { 
			id: currentRoom.value.id, 
			topic: topicIndex, 
		} 
	})
}
function isRoomHistoryEmpty(): boolean {
	return currentRoom.value.history == undefined 
		|| currentRoom.value.history.length == 0
		|| stories.value == undefined 
		|| stories.value.length == 0
}

function confirmHyperlink(link: string) {
	if (window.confirm("Trust this link?")) {
		window.open(link);
	}
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
					<div class="grid grid-cols-6 p-4 items-center">
						<p class="font-semibold text-black dark:text-gray-400">Story Name</p>
						<p class="font-semibold text-black dark:text-gray-400">Points</p>
						<p class="font-semibold text-black dark:text-gray-400 grow"># Of Voters</p>
						<p class="font-semibold text-black dark:text-gray-400">URL</p>
						<button v-if="!isRoomHistoryEmpty()" @click="exportAllStories()" class="w-fit text-sm truncate dark:bg-orange-500 bg-blue-800 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 font-medium hover:text-blue-800 hover:dark:text-orange-500 hover:bg-white hover:dark:bg-white">
							<p class="hidden lg:inline">Export All To CSV</p>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-download lg:hidden" viewBox="0 0 16 16">
								<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
								<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
							</svg>
						</button>
						<button v-if="!isRoomHistoryEmpty()" @click="deleteAllStories()" class="ml-1 lg:ml-5 w-fit dark:bg-orange-500 bg-blue-800 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 hover:text-blue-800 hover:dark:text-orange-500 hover:bg-white hover:dark:bg-white">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
								<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
								<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
							</svg>
						</button>
						<p v-else class="font-semibold text-black dark:text-gray-400 grow">Export</p>
					</div>
					<div class="border-gray-400 border-b-2"></div>
					<div class="min-h-[48px]">
						<div class="grid grid-cols-6 p-4 items-center" v-for="(story, index) in stories">
							<p class="font-semibold text-gray-400">{{story.name}}</p>
							<p class="pl-5 font-semibold text-gray-400">{{story.points}}</p>
							<p class="pl-7 font-semibold text-gray-400 grow">{{story.numberOfVoters}}</p>
							<button @click="confirmHyperlink(story.url)" :disabled="story.url === '' || story.url === undefined" class="w-fit text-sm truncate bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 font-medium disabled:text-blue-800 disabled:dark:text-orange-500 disabled:bg-transparent disabled:dark:bg-transparent hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16">
									<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
								</svg>
							</button>
							<button @click="exportStory(index,story.name)" class="w-fit lg:w-full text-sm truncate bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 font-medium hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
								<p class="hidden lg:inline">Export To CSV</p>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-download lg:hidden" viewBox="0 0 16 16">
									<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
									<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
								</svg>
							</button>
							<button @click="deleteStory(index)" class="ml-1 lg:ml-5 w-fit bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
									<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
									<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
								</svg>
							</button>
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