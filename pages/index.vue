<script setup lang="ts">
import HCRoom from "backend/models/HCRoom";
import ErrorMessage from "../components/errorMessage.vue";
import Config from "chart.js/dist/core/core.config";
import ModalPopup from "../components/modalPopup.vue";
import { useDark } from "@vueuse/core"

const joinCode = ref("")
const config = useRuntimeConfig()
const isDark = useDark()

onMounted(() => {
});

</script>
<template>
	<permenantHeader></permenantHeader>
	<div class="h-screen dark:bg-DarkGrey text-black dark:text-gray-300 p-40 flex flex-col">
		<div class="w-[513px] text-6xl pb-4 font-bold leading-[72px]">Agile Planning Poker for badass agile teams.</div>
		<div class="w-[513px] text-xl pb-8 font-medium leading-[30px]">We’re different. Hydracards is the best choice for the better and badass teams.</div>
   		<a href="/create" class="text-lg font-medium leading-7  dark:text-gray-100 text-black w-[171px] h-14 px-7 py-4 bg-blue-800 dark:bg-HCOrange shadow justify-center items-center gap-2 flex">Get Started</a>
		<img v-show="isDark" src="@/logos/card_logo.png" alt="My Image" style="width: 554px; height: 606px"  class="flex xl:absolute xl:bottom-30 xl:right-72"/>
		<img v-show="!isDark" src="@/logos/card_logo_blue.png" alt="My Image" style="width: 554px; height: 606px"  class="flex xl:absolute xl:bottom-30 xl:right-72"/>
	</div>
</template>