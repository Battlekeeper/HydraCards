<script setup lang="ts">
	defineEmits(['setStoryPoints', 'close'])
	const points = ref(0)
</script>

<template>
	<div class="flex p-10 bg-gray-300 dark:bg-gray-700 rounded-xl gap-4">
		<span @click="$emit('close')" class="fixed right-9 top-3 cursor-pointer select-none font-bold">✕</span>
		<input type="number" v-model="points" class="w-[90px] text-center placeholder-current text-slate-800 border border-black text-base font-normal leading-normal bg-gray-300 p-2 rounded-md">
		<button @click="$emit('setStoryPoints', points)" class="p-3 text-white dark:text-white text-base font-small rounded-md pr-8 pl-8 shadow bg-blue-800 dark:bg-orange-500 border border-transparent">Set Story Points</button>
	</div>
</template>