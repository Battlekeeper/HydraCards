<script setup lang="ts">
import { io } from "socket.io-client"

onMounted(()=> {
	const url = useRuntimeConfig().public.socketUrl || window.location.origin;
	const socket = io(url);
	socket.on("connect",() => {
		console.log("Client Side Connected")
	});
});

</script>
<template>
	<p class="text-center">Welcome!</p>
</template>
