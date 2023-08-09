<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import ErrorMessage from "../components/errorMessage.vue";
import Config from "chart.js/dist/core/core.config";
import ModalPopup from "../components/modalPopup.vue";

const colormode = useColorMode()

onMounted(() => {
});

</script>
<template>
	<permenantHeader></permenantHeader>

	<div class="grid grid-cols-2 grid-rows-1 pl-[150px] pr-[150px] mt-16">

		<div class="flex flex-col justify-center justify-self-center">
			<div class="w-[513px] text-6xl pb-4 font-bold">Agile Planning Poker for badass agile teams.</div>
			<div class="w-[513px] text-xl pb-8 font-medium leading-[30px]">We’re different. Hydracards is the best choice
				for
				the
				better and badass teams.</div>
			<a href="/create"
				class="rounded-md text-lg font-medium leading-7 text-white dark:text-gray-100 w-[171px] h-14 px-7 py-4 bg-blue-800 dark:bg-HCOrange dark:hover:bg-white dark:hover:text-orange-500 shadow justify-center items-center gap-2 flex">Get
				Started</a>
		</div>

		<img v-show="colormode.preference == 'dark'" src="/images/card_logo.png" alt="My Image" class="" />
		<img v-show="colormode.preference != 'dark'" src="/images/card_logo_blue.png" alt="My Image" class="" />
	</div>
</template>