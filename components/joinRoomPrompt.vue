<script setup lang="ts">
import { ref } from "vue"
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";

const route = useRoute()
const name = ref(null)
const config = useRuntimeConfig()
const userId: Ref<string> = ref(useCookie('_id').value as string)
const currentUser = ref(new HCUser)
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.serverUrl })
currentUser.value = user.value as HCUser
//name.value = currentUser.value.displayName
const file: Ref<any> = ref()
const fileUrl: Ref<any> = ref()
const props = defineProps(["roomId"])

fileUrl.value = currentUser.value.avatar
//@ts-ignore
name.value = currentUser.value.displayName

async function apiJoinRoom() {
	var response = await useFetch("api/room/joinRoom?id=" + props.roomId, { credentials: "include", baseURL: config.public.baseUrl })

	// @ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	if (room == undefined) {
		//console.log("no")
	} else {
		//router.push({ path: 'room', query: { id: room.id } })
		//TODO: Find a way to have router.push not be shallow redirect
		window.location.href = "/room?id=" + room.id
	}
}

async function setNameAndProfileAndJoin() {
	var response;
	/*
	if (currentUser.value.currentRoom != undefined) {
		if (currentUser.value.currentRoom.toString() != props.roomId) {
			response = await useFetch("api/room/joinRoom?id=" + props.roomId, { credentials: "include", baseURL: config.public.baseUrl })
			//@ts-ignore
			userId.value = response?.data.value.id
		}
	} else {
		response = await useFetch("api/room/joinRoom?id=" + props.roomId, { credentials: "include", baseURL: config.public.baseUrl })
		//@ts-ignore
		userId.value = response?.data.value.id
	}
	*/
	response = await useFetch("api/room/joinRoom?id=" + props.roomId, { credentials: "include", baseURL: config.public.baseUrl })
	const formData = new FormData();
	formData.append('profileImage', file.value);
	fetch("api/user/profileupload", { method: "POST", body: formData })
	await useFetch("api/user/setname?name=" + name.value, { credentials: "include", baseURL: config.public.baseUrl })
	window.location.href = "/room?id=" + props.roomId
}
function storeProfile(event: any) {
	file.value = event.srcElement.files[0]
	fileUrl.value = URL.createObjectURL(file.value)
}
function click() {
	//@ts-ignore
	document.getElementById('fileInput').click()
}
</script>

<template>
	<div class="flex bg-gray-300 dark:bg-gray-700 flex-col w-1/3 min-w-[750px] items-center"
		style="width: 40svw; aspect-ratio: 1/0.46266666666;">
		<h1 class="w-96 text-center text-black dark:text-sky-50 text-4xl font-bold leading-10 mt-[74px]">Choose a Nickname</h1>
		<p class="w-96 text-center text-black dark:text-gray-300 text-xl font-medium">What would you like to be called?</p>
		<span class="mt-3">
			<input v-model="name" text="number" class="w-80 placeholder-current text-slate-800 border border-black text-base font-normal leading-normal p-2 rounded-md"
				placeholder="Enter your name">
			<button @click="setNameAndProfileAndJoin"
				class="ml-2 text-blue-800 dark:text-orange-500 bg-gray-300 dark:bg-slate-700 p-2 pl-4 pr-4 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal">
				Join
			</button>
		</span>
		<span>
			<input hidden id="fileInput" @change="storeProfile($event)" type="file" accept="image/*">
			<button @click="click" class="mt-9 text-blue-800 dark:text-orange-500 bg-gray-300 dark:bg-slate-700 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px]">Change Avatar</button>
			<img v-show="fileUrl != undefined" class="m-4 inline" width="64" height="64" :src="fileUrl">
		</span>
	</div>
</template>