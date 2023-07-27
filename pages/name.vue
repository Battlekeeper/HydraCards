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
name.value = currentUser.value.displayName
const file:Ref<any> = ref()
const fileUrl:Ref<any> = ref()

definePageMeta({
	//middleware: ["nullroomredirect"]
})

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
	<permenantHeader></permenantHeader>
	<div class="h-full dark:bg-DarkGrey">
		<input class="border-2 border-green-600 dark:bg-DarkGrey" placeholder="Enter your name" type="text" v-model="name">
		<button @click="setNameAndProfileAndJoin" class="my-4">
			<span class=" px-2 py-2 m-2 hover:bg-gray-700 text-slate-50 bg-gray-500 rounded-lg text-sm">Enter Room</span>
		</button>

		<input hidden id="fileInput" @change="storeProfile($event)" type="file" accept="image/*">
		<button @click="click">
			<span class="px-2 py-2 m-2 hover:bg-gray-700 text-slate-50 bg-gray-500 rounded-lg text-sm">Upload Profile Image</span>
		</button>
		<img width="128" height="128" :src="fileUrl">
	</div>
</template>