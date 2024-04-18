<script setup lang="ts">
	defineEmits(['setStoryPoints', 'close'])
	const props = defineProps(['default'])
	const points = ref(props.default)
</script>

<template>
	<div class="flex flex-col bg-gray-300 dark:bg-gray-700 rounded-xl ">
		<div class="flex justify-end pt-4 pr-4">
			<button @click="$emit('close')" class="font-bold">✕</button>
		</div>
		<div class="flex flex-row gap-4 pb-10 pl-10 pr-10">
			<input type="number" v-model="points" class="w-[90px] text-center placeholder-current text-slate-800 border border-black text-base font-normal leading-normal bg-gray-300 p-2 rounded-md">
			<button @click="$emit('setStoryPoints', points)" class="p-3 text-white dark:text-white text-base font-small rounded-md pr-8 pl-8 shadow bg-blue-800 dark:bg-orange-500 border border-transparent">Set Story Points</button>
		</div>
	</div>
</template>