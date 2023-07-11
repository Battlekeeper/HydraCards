<script setup lang="ts">
//@ts-ignore
import { io } from "socket.io-client"
import { ref } from "vue"

onMounted(()=>{
	const socket = io("http://localhost:3001");
	socket.on("connect",() => {
		console.log("Client Side Connected")
	})
})

</script>
<template>
	<p class="text-center">Welcome!</p>
</template>