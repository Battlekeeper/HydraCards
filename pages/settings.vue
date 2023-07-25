<script setup lang="ts">
import PermenantHeader from '../components/permenantHeader.vue';
import { useDark, useToggle } from "@vueuse/core"

const isDark = useDark()
isDark.value = true //default to dark mode for now
const toggleDark = useToggle(isDark)
//console.log("isDark:", isDark); 
//console.log("toggleDark:", toggleDark);

</script>

<template >
	<permenantHeader></permenantHeader>
	<div class="h-screen dark:bg-DarkGrey">
	  <h1 class="font-sans bold text-4xl text-center dark:text-white">Settings page</h1>
		<button @click="toggleDark()" class="py-3 px-4 bg-black text-white rounded-md dark:bg-white dark:text-black">
		  {{ isDark ? "Light" : "Dark" }} Mode
		</button>
	</div>
  </template>