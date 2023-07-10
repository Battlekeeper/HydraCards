<script setup>
	import { ref } from "vue"
	import { useRouter } from "vue-router";
	import { io } from "socket.io-client";

	const route = useRouter()
	//const socket = io("ws://localhost:3000");

	const props = defineProps(['members'])

</script>

<template>
	<p>{{props.members}}</p>
</template>

