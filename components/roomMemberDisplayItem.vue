<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";

const route = useRouter()

const props = defineProps(['member'])
const hostClass = ref("")
const statusIcon = ref("❌")
const onlineIcon = ref("💻")

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
	<p :class="hostClass">
	<div class="flex">
		<img width="32" height="32" :src="member.avatar" alt="Avatar" class="mr-2" /> {{ member.displayName }}
		{{ statusIcon }} {{ onlineIcon }}
	</div>
	</p>
</template>
