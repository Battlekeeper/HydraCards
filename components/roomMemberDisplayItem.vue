<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";

const route = useRouter()

const props = defineProps(['member'])
const hostClass = ref("")
const statusIcon = ref("❌")

if (props.member.permissions.host)
	{
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


watch(props, () => {
	if (props.member.permissions.host)
	{
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
})
</script>

<template>
	<p :class="hostClass">
		<div class="flex">
			<img :src="member.avatar" alt="Avatar" class="mr-2" /> {{ member.displayName }} {{statusIcon}}
		</div>
	</p>
</template>
