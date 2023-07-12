<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import RoomMemberDisplayLine from "./roomMemberDisplayLine.vue";

const route = useRouter()
//const socket = io("ws://localhost:3000");

const props = defineProps(['members'])
function memberDisplayColor() {

}


</script>

<template>
	<div v-for="member in  props.members ">
		<RoomMemberDisplayLine :member=member></RoomMemberDisplayLine>
	</div>
</template>
