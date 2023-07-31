<script setup lang="ts">
import { ref } from "vue"
import PermenantHeader from '../components/permenantHeader.vue';
const colormode = useColorMode()

const route = useRoute()
</script>

<template>
	<permenantHeader></permenantHeader>
	<div class="flex flex-col items-center justify-center mt-[38px]">
		<h1 class="text-4xl font-bold mb-[16px]">HydraCards</h1>
		<p class="text-center text-xl font-semibold pb-[54px]">Why we do what we do.</p>
		<p class="md:w-[554px] w-[250px] text-center text-lg font-small pb-[6px]">HydraCards started one day in a
			undisclosed place, from there we ran it straight up to the top of the free category. From there we just kept
			developing and kept striving for greatness.</p>
		<img v-show="colormode.preference == 'dark'" class="w-96 h-auto"
			src="@/images/poker_chip.png" />
		<img v-show="colormode.preference != 'dark'" class="w-96 h-auto"
			src="@/images/poker_chip_blue.png" />
	</div>
</template>