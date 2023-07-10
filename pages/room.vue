<script setup lang="ts">
import { HCRoom, HCUser } from "modules/socket";
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import roomMemberDisplay from "../components/roomMemberDisplay.vue"

const route = useRouter()
const socket = io("ws://localhost:3000");

let roomId: string = route.currentRoute.value.query.id as string
let room:HCRoom = await useFetch("/api/getRoomById?id="+roomId).data.value as unknown as HCRoom

const roomMembers:Ref<Array<HCUser>> = ref(new Array<HCUser>)

onMounted(() => {
	let user:HCUser = window.localStorage.getItem("HCActiveUser") as unknown as HCUser

	socket.on("connect", () => {
		socket.emit("joinSocketRoom", room.id)
	})
	socket.on("roomMemberUpdate", (members:Array<HCUser>) => {
		roomMembers.value = members
	})
})

</script>
<template>
	<p class="text-center">{{room}}</p>
	<br>
	<roomMemberDisplay :members=roomMembers></roomMemberDisplay>
</template>