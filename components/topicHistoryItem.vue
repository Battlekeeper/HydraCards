<script setup lang="ts">
const props = defineProps(["topicName", "index"])
const route = useRouter()
defineEmits(['downloadClick'])
</script>

<template>
	<div>
		<p class="flex text-center items-center">
			<slot></slot>
		</p>
		<button @click="$emit('downloadClick')" class="ml-2 px-2 py-2 m-2 hover:bg-indigo-600 text-white bg-indigo-400 rounded-lg text-sm">
			Download CSV
		</button>
	</div>
</template>