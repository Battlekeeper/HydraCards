<script setup lang="ts">
import { ref } from "vue"
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
import { useDark } from "@vueuse/core"
const isDark = useDark()
const route = useRoute()
const name = ref("")
const config = useRuntimeConfig()
const userId: Ref<string> = ref(useCookie('_id').value as string)
const currentUser = ref(new HCUser)
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.serverUrl })
currentUser.value = user.value as HCUser
//name.value = currentUser.value.displayName
const joinCode = ref("")
const file:Ref<any> = ref()
const fileUrl:Ref<any> = ref()
const props = defineProps(["content", "pagelink", "size"])

//CLEAN FILE
console.log(await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl }))
definePageMeta({
	//middleware: ["nullroomredirect"]
})
async function apiJoinRoom() {
	var response = await useFetch("api/room/joinRoom?id=" + joinCode.value, { credentials: "include", baseURL:  config.public.baseUrl})

	// @ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	if (room == undefined) {
		console.log("no")
	} else {
		//router.push({ path: 'room', query: { id: room.id } })
		//TODO: Find a way to have router.push not be shallow redirect
		window.location.href = "/room?id=" + room.id
	}
}

async function setNameAndProfileAndJoin() {
	var response;
	if (currentUser.value.currentRoom != undefined) {
		if (currentUser.value.currentRoom.toString() != route.query.id) {
			response = await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
			//@ts-ignore
			userId.value = response?.data.value.id
		}
	} else {
		response = await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
		//@ts-ignore
		userId.value = response?.data.value.id
	}
	const formData = new FormData();
	formData.append('profileImage', file.value);
	fetch("api/user/profileupload", { method: "POST", body: formData })
	await useFetch("api/user/setname?name=" + name.value, { credentials: "include", baseURL: config.public.baseUrl })
	window.location.href = "/room?id=" + route.query.id
}
function storeProfile(event:any){
	file.value = event.srcElement.files[0]
	fileUrl.value = URL.createObjectURL(file.value)
}
function click() {
	//@ts-ignore
	document.getElementById('fileInput').click()
}

</script>

<template>
	<div class="dark:bg-slate-600 border max-w-xl flex" :style="{ width: size + 'px', height: (size/2) + 'px' }">
		<div> 
			<div class="w-96 h-36 justify-center items-center gap-3 inline-flex">
	<div class="w-96 relative">
		<div class="w-96 top-0 absolute left-28 datext-slate-50 text-4xl font-bold leading-10">Choose a Nickname</div>
		<div class="w-96 left-[85px] top-[44.11px] absolute text-center text-black dark:text-gray-300 text-xl font-medium leading-loose">What would you like to be called?</div>
	</div>
		<div class="w-80 h-11 gap-1.5 absolute bottom-20 left-24">
			<div class="h-11 px-3.5 py-2.5 text-black dark:bg-slate-50 rounded-lg shadow border border-gray-300">
			<div class="h-6 justify-start items-center gap-">
			<input placeholder="Enter your name" class="grow shrink basis-0 text-gray-500 text-base font-normal leading-normal">
				<div class="w-6 h-6 relative"></div>
		</div>
		<button @click="setNameAndProfileAndJoin" class="my-4">
			<span class="text-blue-800 dark:text-orange-500 text-base font-medium leading-normal w-16 px-4 py-3 rounded-md shadow border border-blue-800 dark:border-orange-500 absolute -bottom-1 -right-20">Join</span>
		</button>

  <div class="w-40 px-4 py-3 rounded-md shadow border relative bottom-4 left-10 border-blue-800 dark:border-orange-500 text-blue-800 dark:text-orange-500 font-medium">
		<input hidden id="fileInput" @change="storeProfile($event)" type="file" accept="image/*">
			<button @click="click">
				<span>Upload Avatar</span>
			</button>
		</div>
		<img class="relative bottom-16 left-56" width="64" height="64" :src="fileUrl">
		</div>
		</div>
		<input type="text" v-model="joinCode" class="relative bottom-16 border border-black">
	</div>
</div>
</div>

</template>