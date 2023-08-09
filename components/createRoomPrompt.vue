<script setup lang="ts">
import { ref } from 'vue';
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
import Toggle from '@vueform/toggle'


defineEmits(['cancel'])

const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const showComponent = ref(false)
const config = useRuntimeConfig()
const root = ref(null)
const props = defineProps(["content", "pagelink", "size"])
const url = ref("")
const name = ref("")
const roomTopicName = ref("")
const route = useRoute()
const userId = useCookie('_id')
const file: Ref<any> = ref()
const fileUrl: Ref<any> = ref()
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.baseUrl })
currentUser.value = user.value as HCUser


if (currentUser.value != undefined){
	name.value = currentUser.value.displayName
	fileUrl.value = currentUser.value.avatar
}

const timerMinutes = ref(0)
const timerSeconds = ref(0)
const timerEnabled = ref(false)

async function apiCreateRoom() {
	var response = await useFetch("api/room/createRoom", { query: {
		topicName: roomTopicName.value,
		timer: timerMinutes.value * 60 + timerSeconds.value,
		timerEnabled: timerEnabled.value
	}, credentials: "include", baseURL: config.public.baseUrl })
	//@ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect

	response = await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
	const formData = new FormData();
	formData.append('profileImage', file.value);
	fetch("api/user/profileupload", { method: "POST", body: formData })
	await useFetch("api/user/setname?name=" + name.value, { credentials: "include", baseURL: config.public.baseUrl })
	window.location.href = "/room?id=" + room.id
}

function storeProfile(event: any) {
	file.value = event.srcElement.files[0]
	fileUrl.value = URL.createObjectURL(file.value)
}
function click() {
	//@ts-ignore
	document.getElementById('fileInput').click()
}

watch(timerMinutes, () => {
	if (timerMinutes.value > 99){
		timerMinutes.value = 99
	}
})
watch(timerSeconds, () => {
	if (timerSeconds.value > 59){
		timerSeconds.value = 59
	}
})
</script>

<template>
	<div class="grid grid-cols-2 grid-rows-1 bg-white-500 dark:bg-slate-800 flex-col w-1/3 min-w-[750px] items-center "
		style="width: 40svw; aspect-ratio: 1/0.46266666666;">
		<div class="flex flex-col h-full p-8">
			<p class="dark:text-slate-300 text-black text-base font-semibold pb-2">Story Title</p>
			<input v-model="roomTopicName" text="text" class="w-80 bg-gray-300 font-normal dark:bg-gray-700 p-4 rounded-md text-black"
				placeholder="Enter Story Name">
			<div class="flex dark:bg-gray-700 bg-gray-300 mt-5 w-80 rounded-md flex-col p-4 pb-8">
				<p class="text-white-900 font-bold text-xl">Nickname</p>
				<input v-model="name" text="text" class="text-slate-800 font-normal leading-normal p-2 rounded-md"
					placeholder="Enter your name">
			</div>
			<span>
				<input hidden id="fileInput" @change="storeProfile($event)" type="file" accept="image/*">
				<button @click="click"
					class="mt-7 text-blue-800 hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px]">Change
					Avatar</button>
				<img v-show="fileUrl != undefined" class="m-4 inline " width="40" height="40" :src="fileUrl">
			</span>
		</div>
		<div class="flex flex-col h-full p-8">
			<div class="dark:bg-gray-700 bg-gray-300 rounded-md p-4 mt-6">
				<div class="flex justify-between">
					<h1 class="text-white-900 text-xl font-bold">Timed Room</h1>
					<Toggle v-model="timerEnabled" />
				</div>
				<p class="w-72 h-16 text-black dark:text-slate-400 text-base font-medium leading-normal">Change whether players must submit their
					answers by a certain time.</p>
			</div>
			<div v-if="timerEnabled" class="gap-8 inline-flex justify-center">
				<div class="dark:text-slate-300 text-black text-sm font-bold leading-tight">MINS</div>
				<div class="dark:text-slate-300 text-black text-sm font-bold leading-tight">SECS</div>
			</div>
			<div v-if="timerEnabled" class="bg-gray-300 dark:bg-gray-700 rounded-2xl flex justify-center pt-2 pb-2">
				<input v-model="timerMinutes" type="number" class="w-12 h-12 text-center bg-white dark:bg-slate-800 text-black dark:text-white text-2xl font-normal rounded-md pl-2 pr-2" placeholder="00">
				<p class="w-fit h-fit text-[30px] pl-2 pr-2">:</p>
				<input v-model="timerSeconds" type="number" class="w-12 h-12 text-center bg-white dark:bg-slate-800 text-black dark:text-white text-2xl font-normal rounded-md pl-2 pr-2" placeholder="00">
			</div>
			<div class="flex mt-6 gap-4">
				<button
				@click="$emit('cancel');" class="text-blue-800 dark:text-orange-500 p-2 hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px]">Cancel</button>
				<button @click="apiCreateRoom()" class="dark:bg-orange-500 bg-blue-800 hover:bg-white hover:text-blue-800 dark:hover:bg-white dark:hover:text-orange-500 text-white dark:text-white p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px]">Create
					Room</button>
			</div>
		</div>
	</div>
	</template>