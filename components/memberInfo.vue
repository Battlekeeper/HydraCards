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
</script>

<template>
	<div class="flex flex-col bg-gray-300 dark:bg-gray-700 rounded-xl gap-4">
		<button @click="$emit('cancel');" class="flex justify-end text-black dark:text-white pr-4 pt-4">X</button>
		<div v-if="currentUser.permissions.host && props.member.id != currentUser.id" class="pb-10 pl-10 pr-10">
			<div class="flex flex-row pb-2">
				<img width="60" height="60" :src="member.avatar" alt="Avatar" class="mr-2" />
				<p class="text-black dark:text-gray-50 text-5xl font-semibold leading-10">{{ props.member.displayName }}</p>
			</div>
			<div class="flex flex-row">
				<button @click="kick()" class="bg-blue-800 dark:bg-orange-500 text-white rounded-md p-3 mr-4">Kick
					Player</button>
				<button v-if="props.member.permissions.host" @click="promoteToModerator(false)"
					class="bg-transparent dark:text-orange-500 border p-3 dark:border-orange-500 border-blue-800 text-blue-800 rounded-md">Demote from Moderator</button>
				<button v-if="!props.member.permissions.host" @click="promoteToModerator(true)"
					class="bg-transparent dark:text-orange-500 border p-3 dark:border-orange-500 border-blue-800 text-blue-800 rounded-md">Promote
					to Moderator</button>
			</div>
		</div>
		<div v-if="props.member.id == currentUser.id" class="flex pb-10 pl-10 pr-10">
			<input v-model="displayName" text="text"
				class="w-80 mt-4 mr-2 bg-white dark:bg-gray-300 font-normal p-2 rounded-md text-black"
				placeholder="Enter Your Name">
			<button @click="apiSetDisplayName()"
			class="bg-transparent text-blue-800 dark:text-orange-500 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium">Set
			Name</button>
	</div>
</div></template>