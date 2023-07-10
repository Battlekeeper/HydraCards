<script setup lang="ts">
import { HCRoom, HCUser } from "modules/socket";
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";

const route = useRouter()
const socket = io("ws://localhost:3000");

let roomId: string = route.currentRoute.value.query.id as string

let room:HCRoom = await useFetch("/api/getRoomById?id="+roomId).data.value as unknown as HCRoom
onMounted(() => {
	let user:HCUser = window.localStorage.getItem("HCActiveUser") as unknown as HCUser

	socket.on("connect", () => {
		socket.emit("syncUserSocketId", user)
		socket.emit("joinSocketRoom", room.id)
	});
})

</script>
<template>
	<p class="text-center">{{room}}</p>
</template>