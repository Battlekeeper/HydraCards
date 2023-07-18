<script setup lang="ts">
import { ref } from "vue"
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
const route = useRoute()
const name = ref("")
const config = useRuntimeConfig()
const userId: Ref<string> = ref(useCookie('_id').value as string)
const currentUser = ref(new HCUser)
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, {baseURL: config.public.serverUrl})
currentUser.value = user.value as HCUser
name.value = currentUser.value.displayName


definePageMeta({
	//middleware: ["nullroomredirect"]
})

async function setNameAndJoin() {
	if (currentUser.value.currentRoom != undefined){
		if (currentUser.value.currentRoom.toString() != route.query.id){
			await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
		}
	} else {
		await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
	}
	
	await useFetch("api/user/setname?name=" + name.value, { credentials: "include", baseURL: config.public.baseUrl })
	window.location.href = "/room?id=" + route.query.id
}
</script>

<template>
	<input class="border-2 border-green-600" placeholder="Enter your name" type="text" v-model="name">
	<button @click="setNameAndJoin" class="my-4">
		<span class=" px-2 py-2 m-2 hover:bg-gray-700 text-white bg-gray-500 rounded-lg text-sm">Set name</span>
	</button>
</template>