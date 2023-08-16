<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router";
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";


const props = defineProps(['member', "roomStatus", "userId"])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")
const focusedIcon = ref("😵")
const config = useRuntimeConfig()
const name = ref(props.member.displayName)
const showUserInfo = ref(false)
const currentUser = ref(new HCUser)

const { data: user } = await useFetch(`api/user/getUserById?id=` + props.userId, { baseURL: config.public.baseUrl })
currentUser.value = user.value as HCUser


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
	onlineIcon.value = "🌎" //ON LINE
} else {
	onlineIcon.value = "🌐" //OFF LINE
}
if (props.member.focused){
		focusedIcon.value = "😎"
} else {
	focusedIcon.value = "💤"
}
if (!props.member.online){
	focusedIcon.value = ""
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
			if (statusIcon.value == undefined || statusIcon.value == ""){
				statusIcon.value = "N/A"
			}
		}
	}
	
	if (props.member.online) {
		onlineIcon.value = "🌎" //ON LINE
	} else {
		onlineIcon.value = "🌐" //OFF LINE
	}
	name.value = props.member.displayName

	if (props.member.focused){
		focusedIcon.value = "😎"
	} else {
		focusedIcon.value = "💤"
	}
	if (!props.member.online){
		focusedIcon.value = ""
	}

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
				<div class="grid grid-cols-4 gap-1">
					<div class="" v-show="props.member.permissions.host">🌟</div>
					<div class="" v-show="!props.member.permissions.host"></div>
					<div class=""> {{ focusedIcon }}</div>
					<div class=""> {{ onlineIcon }}</div>
					<div class="w-[30px] text-center"> {{ statusIcon }}</div>
				</div>
			</div>
		</div>
	</div>
	<ModalPopup v-if="showUserInfo && (props.member.id == props.userId || currentUser.permissions.host)"><memberInfo :user-id=props.userId :member=props.member @cancel="showUserInfo=false;"></memberInfo></ModalPopup>
</template>