<script setup lang="ts">
import { ref } from "vue"
import PermenantHeader from '../components/permenantHeader.vue';
const route = useRoute()
</script>

<template>
	<div class="h-screen dark:bg-DarkGrey dark:text-white">
		<permenantHeader></permenantHeader>
		<h1 class="font-sans bold text-4xl text-center">features page</h1>
	</div>
</template>