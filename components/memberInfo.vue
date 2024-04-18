<script setup lang="ts">
import HCUser from "../backend/models/HCUser";
const emit = defineEmits(['cancel'])
const props = defineProps(["member", "userId"])
const config = useRuntimeConfig()

const currentUser = ref(new HCUser)

const { data: user } = await useFetch(`api/user/getUserById?id=` + props.userId, { baseURL: config.public.baseUrl })
currentUser.value = user.value as HCUser

const displayName = ref(currentUser.value.displayName)
async function kick() {
	await useFetch(`api/room/kickuser?id=` + props.member.id, { baseURL: config.public.baseUrl })
	emit('cancel')
}
async function promoteToModerator(promote:boolean) {
	await useFetch(`api/room/promote?id=` + props.member.id + "&promote=" + promote, { baseURL: config.public.baseUrl })
	emit("cancel")
}
async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, { credentials: "include", baseURL: config.public.baseUrl })
	emit("cancel")
}

watch(displayName, ()=>{
	if (displayName.value.length > 16){
		displayName.value = displayName.value.substring(0,16)
	}
})


</script>

<template>
	<div class="flex flex-col bg-gray-300 dark:bg-gray-700 rounded-xl">
		<div class="flex justify-end pr-4 pt-4">
			<button @click="$emit('cancel');" class="font-bold text-black dark:text-white">✕</button>
		</div>
		<div v-if="currentUser.permissions.host && props.member.id != currentUser.id" class="pb-10 pl-10 pr-10">
			<div class="flex flex-row pb-2">
				<img width="60" height="60" :src="member.avatar" alt="Avatar" class="mr-2" />
				<p class="text-black dark:text-gray-50 text-5xl font-semibold leading-10">{{ props.member.displayName }}</p>
			</div>
			<div class="flex flex-row">
				<button @click="kick()" 
					class="bg-blue-800 dark:bg-orange-500 text-white rounded-md p-3 mr-4 border border-blue-800 dark:border-orange-500 hover:text-blue-800 dark:hover:text-orange-500 hover:bg-white dark:hover:bg-white">Kick
					Player
				</button>
				<button v-if="props.member.permissions.host" @click="promoteToModerator(false)"
					class="bg-transparent dark:text-orange-500 border p-3 dark:border-orange-500 border-blue-800 text-blue-800 rounded-md hover:text-white dark:hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500">
					Demote from Moderator
				</button>
				<button v-if="!props.member.permissions.host" @click="promoteToModerator(true)"
					class="bg-transparent dark:text-orange-500 border p-3 dark:border-orange-500 border-blue-800 text-blue-800 rounded-md hover:text-white dark:hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500">
					Promote to Moderator
				</button>
			</div>
		</div>
		<div v-if="props.member.id == currentUser.id" class="flex pb-10 pl-10 pr-10">
			<input v-model="displayName" text="text" v-on:keyup.enter="apiSetDisplayName()"
				class="w-80 mt-4 mr-2 bg-white dark:bg-gray-300 font-normal p-2 rounded-md text-black"
				placeholder="Enter Your Name">
			<button @click="apiSetDisplayName()" 
				class="w-fit h-fit bg-transparent text-blue-800 dark:text-orange-500 px-2 py-2 mt-4 flex self-center rounded-md border border-blue-800 dark:border-orange-500 font-medium hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
				Set Name
			</button>
	</div>
</div></template>