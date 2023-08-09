<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router";
import HCRoom from "../backend/models/HCRoom";

const props = defineProps(['member', "roomStatus"])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")
const name = ref(props.member.displayName)
const showUserInfo = ref(false)

if (props.member.permissions.host) {
	hostClass.value = "text-red-500"
}
if (props.member.anonymous && props.member.allowanon){
	name.value = "Anonymous"
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
	var room:HCRoom = JSON.parse(localStorage.getItem("room") as string) as HCRoom
	if (room.status == 0) {
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
	} else {
		if (props.member.userVotingStatus == 1){
			statusIcon.value = "👀"
		} else {
			//@ts-ignore
			statusIcon.value = room.votes[props.member.id]
		}
	}
	
	if (props.member.online) {
		onlineIcon.value = "👨‍💻" //ON LINE
	} else {
		onlineIcon.value = "💻" //OFF LINE
	}
	name.value = props.member.displayName

	if (props.member.anonymous && props.member.allowAnon){
		name.value = "Anonymous"
	}
})
</script>

<template>
	<div class="flex">
			<!--<p :class="hostClass"></p>-->
			<div class="pl-6 pr-6 dark:text-slate-400 font-semibold flex w-full justify-between">
				<div @click="showUserInfo = true" class="flex items-center cursor-pointer">
					<img width="32" height="32" :src="member.avatar" alt="Avatar" class="mr-2" />
					<p class="h-fit">{{ name }}</p>
					</div>
					<div class="flex gap-6 items-end">
					<div class="" v-show="props.member.permissions.host">🌟</div>
					<div class=""> {{ onlineIcon }}</div>
					<div class=""> {{ statusIcon }}</div>
				</div>
			</div>
		</div>
		<ModalPopup v-if="showUserInfo && props.member.permissions.host"><memberInfo member="props.member" @cancel="showUserInfo=false;"></memberInfo></ModalPopup>
</template>