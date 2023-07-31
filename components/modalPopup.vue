<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
	<div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close');">
	</div>
	<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg">
		<slot></slot>
	</div>
</template>