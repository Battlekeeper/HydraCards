<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import ErrorMessage from "../components/errorMessage.vue";
import Config from "chart.js/dist/core/core.config";
import ModalPopup from "../components/modalPopup.vue";

const joinCode = ref("")
const config = useRuntimeConfig()

onMounted(() => {
});

</script>
<template>
	<permenantHeader></permenantHeader>
	<p class="text-7xl text-cyan-700 font-medium text-center italic">Welcome!</p>
	<button class="bg-orange">hi</button>
	<div class="flex flex-row justify-between m-10 absolute w-1/2" style="left: 50%; top:50%; transform: translate(-50%, -50%);">
		<a class="text-5xl text-rose-400 font-mono" href="/create">Create Room</a>
		<div>
			<a class="text-5xl text-rose-400 font-mono" href="/join">Join Room</a>
		</div>
	</div>
</template>