<script setup>
import { useRouter } from "vue-router";
const route = useRouter()
</script>

<template>
	<p class="text-2xl text-slate-50 bg-red-500 rounded-lg p-2 w-fit mt-10">
		<slot></slot>
	</p>
</template>