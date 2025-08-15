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
async function promoteToModerator(promote: boolean) {
	await useFetch(`api/room/promote?id=` + props.member.id + "&promote=" + promote, { baseURL: config.public.baseUrl })
	emit("cancel")
}
async function apiSetDisplayName() {
	await useFetch(`api/user/setname?name=` + displayName.value, { credentials: "include", baseURL: config.public.baseUrl })
	emit("cancel")
}

function getAvatarConfig() {
	const urlParams = new URLSearchParams(currentUser.value.avatar)
	let configarr = urlParams.entries().toArray()
	configarr[0][0] = "seed"
	let config: any = {}
	for (let [key, value] of configarr) {
		config[key] = value
	}
	config.backgroundColorHex = "#" + (config.backgroundColor || "ffffff")
	return config
}

const avatarConfig = ref(getAvatarConfig())

async function apiNewAvatar(random = false) {
	if (random) {
		let resp = await useFetch(`api/user/newavatar`, { credentials: "include", baseURL: config.public.baseUrl })
		currentUser.value.avatar = resp.data.value as string
		avatarConfig.value = getAvatarConfig()
	}
	else {
		avatarConfig.value.backgroundType = avatarConfig.value.backgroundTypeBool ? "gradientLinear" : "solid"
		avatarConfig.value.backgroundColor = avatarConfig.value.backgroundColorHex.substring(1)
		const queryString = new URLSearchParams(avatarConfig.value).toString();
		let resp = await useFetch(`api/user/newavatar?${queryString}`, { credentials: "include", baseURL: config.public.baseUrl })
		currentUser.value.avatar = resp.data.value as string
	}
}

watch(displayName, () => {
	if (displayName.value.length > 16) {
		displayName.value = displayName.value.substring(0, 16)
	}
})
function onAvatarInputChange() {
	apiNewAvatar()
}
</script>

<template>
	<div class="flex flex-col bg-gray-300 dark:bg-gray-700 rounded-xl">
		<div class="flex justify-end pr-4 pt-4">
			<button @click="$emit('cancel');" class="font-bold text-black dark:text-white">✕</button>
		</div>
		<div v-if="currentUser.permissions.host && props.member.id != currentUser.id" class="pb-10 pl-10 pr-10">
			<div class="flex flex-row pb-2">
				<img width="60" height="60" :src="member.avatar" alt="Avatar" class="mr-2" />
				<p class="text-black dark:text-gray-50 text-5xl font-semibold leading-10">{{ props.member.displayName }}
				</p>
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
		<div v-if="props.member.id == currentUser.id" class="flex flex-col pb-10 pl-10 pr-10">
			<div class="flex">
				<input v-model="displayName" text="text" v-on:keyup.enter="apiSetDisplayName()"
					class="w-80 mt-4 mr-2 bg-white dark:bg-gray-300 font-normal p-2 rounded-md text-black"
					placeholder="Enter Your Name">
				<button @click="apiSetDisplayName()"
					class="w-fit h-fit bg-transparent text-blue-800 dark:text-orange-500 px-2 py-2 mt-4 flex self-center rounded-md border border-blue-800 dark:border-orange-500 font-medium hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
					Set Name
				</button>
			</div>
			<div class="flex gap-4">
				<img width="60" height="60" :src="currentUser.avatar" alt="Avatar" class="mt-4" />
				<button @click="apiNewAvatar(true)"
					class="w-fit h-fit bg-transparent text-blue-800 dark:text-orange-500 px-2 py-2 mt-4 flex self-center rounded-md border border-blue-800 dark:border-orange-500 font-medium hover:text-white hover:dark:text-white hover:bg-blue-800 hover:dark:bg-orange-500">
					Randomize Avatar
				</button>
			</div>
			<div class="flex flex-col w-56">
				<div class="flex gap-3 justify-between">
					<label>Scale</label>
					<input type="range" name="scale" :min="50" :max="150" :step="1" v-model="avatarConfig.scale"
						@mouseup="onAvatarInputChange" />
				</div>
				<div class="flex gap-3 justify-between">
					<label>Radius</label>
					<input type="range" name="radius" :min="0" :max="50" :step="1" v-model="avatarConfig.radius"
						@mouseup="onAvatarInputChange" />
				</div>
				<div class="flex gap-3 justify-between">
					<label>Translate X</label>
					<input type="range" name="translatex" :min="-15" :max="15" :step="1"
						v-model="avatarConfig.translateX" @mouseup="onAvatarInputChange" />
				</div>
				<div class="flex gap-3 justify-between">
					<label>Translate Y</label>
					<input type="range" name="translatey" :min="-15" :max="15" :step="1"
						v-model="avatarConfig.translateY" @mouseup="onAvatarInputChange" />
				</div>
				<div class="flex gap-3 justify-between">
					<label>Rotate</label>
					<input type="range" name="rotate" :min="0" :max="360" :step="1"
						v-model="avatarConfig.rotate" @mouseup="onAvatarInputChange" />
				</div>
				<div class="flex gap-3 justify-between">
					<label>Color</label>
					<input type="color" name="backgroundColor" v-model="avatarConfig.backgroundColorHex" @change="onAvatarInputChange" />
				</div>
			</div>
		</div>
	</div>
</template>