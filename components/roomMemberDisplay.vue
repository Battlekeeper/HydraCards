<script setup>
	import { ref } from "vue"
	import { useRouter } from "vue-router";
	import { io } from "socket.io-client";

	const route = useRouter()
	//const socket = io("ws://localhost:3000");

	const props = defineProps(['members'])

</script>

<template v-for="member in props.members">
	<p v-for="member in props.members">
		<p v-if="member.permissions.host" class="text-red-500">
			{{member.displayName}}
		</p>
		<p v-else>
			{{member.displayName}}
		</p>
	</p>
</template>
