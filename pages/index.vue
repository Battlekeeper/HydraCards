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
	<div class="h-screen dark:bg-DarkGrey p-40">
		<div class="w-[513px]  text-white text-6xl pb-4 font-bold leading-[72px]">Agile Planning Poker for badass agile teams.</div>
		<div class="w-[513px] text-gray-300 text-xl pb-8 font-medium leading-[30px]">We’re different. Hydracards is the best choice for the better and badass teams.</div>
		<div class="w-[171px] h-14 bg-HCOrange justify-start items-start inline-flex">
 			<div class="w-[171px] h-14 px-7 py-4 bg-HCOrange rounded-md shadow justify-center items-center gap-2 flex">
   				<a href="/create" class="text-white text-lg font-medium leading-7">Get Started</a>
  			</div>
		</div>
		<div class="flex absolute bottom-10 right-48">
			<img src="@/logos/card_logo.png" alt="My Image" style="width: 554px; height: 606px"/>
		</div>
		</div>
</template>