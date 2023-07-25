<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";

const route = useRouter()

const props = defineProps(['member'])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")

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
	<!--<p :class="hostClass"></p>--> <!--remove some?-->
<div class="w-96 h-96 flex-col justify-start items-center gap-5 inline-flex absolute top-56 left-24">
	<div class="bg-slate-600 rounded-2xl flex-col justify-start items-start flex">
	  <div class="self-stretch pl-1 pr-2.5 py-2.5 justify-center items-center gap-2.5 inline-flex">
		<div class="grow shrink basis-0 h-11 pl-11 justify-center items-center gap-44 flex">
		  <div class="p-2.5 justify-center items-center gap-2.5 flex">
			<div class="text-center text-slate-400 text-base font-semibold leading-normal">Name</div>
		  </div>
		  <div class="text-slate-400 text-base font-semibold leading-normal">Vote</div>
		</div>
	  </div>
	  <div class="self-stretch h-px border border-slate-400"></div>
	  <div class="px-6 py-4 flex-col justify-start items-start gap-4 flex">
		  <!--Each name start-->
		<div class="w-80 justify-start items-center gap-14 inline-flex">
		  <div class="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
			<div class="w-6 h-6 relative"></div>
			<div class="grow shrink basis-0 text-slate-400 text-base font-semibold leading-normal flex">
				<img width="32" height="32" :src="member.avatar" alt="Avatar" class="mr-2" /> {{ member.displayName }}
				<div class="absolute right-32"> {{ onlineIcon }}</div>
				<div class="absolute right-10"> {{ statusIcon }}</div>
			</div>
		  </div>
		  <!--Each name end-->
		</div>
	  </div>
	</div>
	<!--positioning and link (keep until everything else is done)-->
	<div class="w-80 h-11 relative">
	  <div class="w-80 h-11 left-0 top-0 absolute justify-center items-center inline-flex">
		<div class="flex-col justify-start items-start gap-1.5 inline-flex">
		  <div class="flex-col justify-start items-start gap-1.5 flex">
			<div class="w-80 h-11 px-3.5 py-2.5 bg-slate-600 rounded-lg justify-start items-center gap-2 inline-flex">
			  <div class="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
				<button class="grow shrink basis-0 text-slate-300 text-base font-normal leading-normal">
					localhost:3000/room?id= <!--{{ currentRoom.id }}-->
				</button>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="w-6 h-6 left-[286px] top-[10.91px] absolute"></div>
	</div>
  </div>
  </template>