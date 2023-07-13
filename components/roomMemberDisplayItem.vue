<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";

const route = useRouter()
//const socket = io("ws://localhost:3000");

const props = defineProps(['member'])
const hostClass = ref("")

if (props.member.permissions.host)
{
	hostClass.value = "text-red-500"
}

</script>

<template>
	<p v-if="member.userVotingStatus == 0" :class="hostClass">
		{{ member.displayName }} ❌
	</p>
	<p v-if="member.userVotingStatus == 1" :class="hostClass">
		{{ member.displayName }}  👀
	</p>
	<p v-if="member.userVotingStatus == 2" :class="hostClass">
		{{ member.displayName }}  ✅
	</p>
	
</template>
