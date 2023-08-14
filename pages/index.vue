<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import ErrorMessage from "../components/errorMessage.vue";
import Config from "chart.js/dist/core/core.config";
import ModalPopup from "../components/modalPopup.vue";

const colormode = useColorMode()
const route = useRoute()

const userKickedPrompt = ref(false)

if (route.query.kicked != undefined){
	userKickedPrompt.value = true
}

onMounted(() => {
});

</script>
<template>
	<permenantHeader></permenantHeader>

	<div class="grid grid-cols-1 xl:grid-cols-2 grid-rows-1 pl-[50px] md:pl-[150px] md:pr-[150px] mt-8 xl:mt-16">
		<div class="flex flex-col justify-center justify-self-center">
			<div class="w-2/3 md:w-96 lg:w-8/12 xl:w-5/6 text-3xl lg:text-5xl xl:text-6xl pb-4 font-bold">Agile Planning Poker for badass agile teams.</div>
			<div class="w-9/12 md:w-full text-md xl:w-2/3 lg:text-lg pb-8 font-medium leading-[30px]">We’re different. Hydracards is the best choice
				for the better and badass teams.</div>
			<a href="/create"
				class="max-xl:hidden rounded-md place-items-end text-lg font-medium leading-7 text-white dark:text-gray-100 w-[171px] h-14 px-7 py-4 bg-blue-800 dark:bg-HCOrange dark:hover:bg-white dark:hover:text-orange-500 hover:bg-indigo-200 hover:text-blue-800 shadow justify-center items-center gap-2 flex">Get Started</a>
		</div>

		<img v-show="colormode.preference == 'dark'" src="/images/card_logo.png" alt="My Image" class="w-90 h-96 flex place-self-center xl:w-11/12 xl:h-[650px]" style="object-fit: contain;"/>
		<img v-show="colormode.preference != 'dark'" src="/images/card_logo_blue.png" alt="My Image" class="w-90 h-96 flex place-self-center xl:w-11/12 xl:h-[650px]" style="object-fit: contain;"/>
		<a href="/create"
				class="xl:hidden rounded-md place-self-center text-lg font-medium leading-7 text-white dark:text-gray-100 w-30 h-12 sm:w-40 sm:h-16 px-7 py-4 bg-blue-800 dark:bg-HCOrange dark:hover:bg-white dark:hover:text-orange-500 hover:bg-indigo-200 hover:text-blue-800 shadow justify-center items-center gap-2 flex">Get Started</a>
	</div>

	<ModalPopup v-if="userKickedPrompt" @close="userKickedPrompt=false;">
		<joinError @cancel="userKickedPrompt=false;" :user-kicked="true"></joinError>
	</ModalPopup>
</template>