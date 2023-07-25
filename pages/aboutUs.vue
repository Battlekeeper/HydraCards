<script setup lang="ts">
import { ref } from "vue"
import PermenantHeader from '../components/permenantHeader.vue';
const route = useRoute()
</script>

<template>
	<div class="h-screen dark:bg-DarkGrey dark:text-white">
		<div class="flex flex-col items-center justify-center">
			<permenantHeader></permenantHeader>
			<div class="justify-center space-y-4 p-12">
				<div class="text-white text-4xl font-bold">HydraCards</div>
					<div class="text-center text-gray-100 text-xl font-semibold">Why we do what we do.</div>
		</div>
		<div class="w-1/3 h-32 text-center text-gray-300 text-lg font-small">HydraCards started one day in a undisclosed place, from there we ran it straight up to the top of the free category. from there we just kept developing and kept striving for greatness. </div>
			<img class="w-96 h-96" src="@/logos/poker_chip.png"/>
		</div>
	</div>
</template>