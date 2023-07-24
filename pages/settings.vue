<script setup lang="ts">
import { ref } from "vue"
import PermenantHeader from '../components/permenantHeader.vue';
const route = useRoute()
</script>

<template>
	<permenantHeader></permenantHeader>
	<h1 class="font-sans bold text-4xl text-center">Settings page</h1>
</template>