<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router";
import HCRoom from "../backend/models/HCRoom";

const props = defineProps(['member'])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")
const currentRoom = ref(new HCRoom)
const isDark = ref(false)

function copy() {
	navigator.clipboard.writeText(window.location.href)
}

if (props.member.permissions.host) {
	hostClass.value = "text-red-500"
}

switch (props.member.userVotingStatus) {
	case 0:
		statusIcon.value = "❌"
		break;
	case 1:
		statusIcon.value = "👀"
		break;
	case 2:
		statusIcon.value = "✅"
		break;
}
if (props.member.online) {
	onlineIcon.value = "👨‍💻" //ON LINE
} else {
	onlineIcon.value = "💻" //OFF LINE
}

watch(props, () => {
	if (props.member.permissions.host) {
		hostClass.value = "text-red-500"
	}

	switch (props.member.userVotingStatus) {
		case 0:
			statusIcon.value = "❌"
			break;
		case 1:
			statusIcon.value = "👀"
			break;
		case 2:
			statusIcon.value = "✅"
			break;
	}
	if (props.member.online) {
		onlineIcon.value = "👨‍💻" //ON LINE
	} else {
		onlineIcon.value = "💻" //OFF LINE
	}
})
</script>

<template>

<div class="w-96 h-96 flex-col items-center gap-5 inline-flex absolute top-56 left-24">
	<div class="bg-gray-300 dark:bg-slate-600 rounded-2xl flex-">
	  <div class="pl-1 pr-2.5 py-2.5 inline-flex">
		<div class="pl-11 items-center gap-44 flex">
		  <div class="p-2.5 ">
			<div class="dark:text-slate-400 font-semibold">Name</div>
		  </div>
		  <div class="dark:text-slate-400 font-semibold">Vote</div>
		</div>
	  </div>
	  <div class="border border-slate-400"></div>
	  <div class="px-6 py-4 flex-col justify-start items-start gap-4 flex">
		
		<div class="w-80">
		  <div class="flex">
			<p :class="hostClass"></p>
			<div class="pl-6 dark:text-slate-400 font-semibold flex">
				<img width="32" height="32" :src="member.avatar" alt="Avatar" class="mr-2" /> {{ member.displayName }}
				<div class="absolute right-32"> {{ onlineIcon }}</div>
				<div class="absolute right-10"> {{ statusIcon }}</div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
	
	<div class="w-80 h-11 relative">
			<div class="w-80 h-11 px-3.5 py-2.5 bg-gray-300 dark:bg-slate-600 rounded-lg">
				<p class="dark:text-slate-300 text-base font-normal leading-normal">
					localhost:3000/room?id={{ currentRoom.id }}
				</p>
				<img v-show="!isDark" @click="copy()" src="@/images/copy_paste_slate-50.png" style="width: 25px; height: 25px" class="relative left-64 bottom-6 hover:bg-slate-700">
				<img v-show="isDark" @click="copy()" src="@/images/copy_paste_black.png" style="width: 25px; height: 25px" class="relative left-64 bottom-6 hover:bg-slate-700">
	  		</div>
	  <div class="w-6 h-6 left-[286px] top-[10.91px] absolute"></div>
	</div>
</div>
  
  </template>