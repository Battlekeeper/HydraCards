<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router";
import HCRoom from "../backend/models/HCRoom";

const props = defineProps(['member'])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")
const currentRoom = ref(new HCRoom)

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
	<div class="flex">
			<!--<p :class="hostClass"></p>-->
			<div class="pl-6 pr-6 dark:text-slate-400 font-semibold flex w-full justify-between">
				<div class="flex items-center">
					<img width="32" height="32" :src="member.avatar" alt="Avatar" class="mr-2" />
					<p class="h-fit">{{ member.displayName }}</p>
				</div>
				<div class="flex gap-6 items-end">
					<div class="" v-show="props.member.permissions.host">🌟</div>
					<div class=""> {{ onlineIcon }}</div>
					<div class=""> {{ statusIcon }}</div>
				</div>
			</div>
		</div>
</template>