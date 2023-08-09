<script setup lang="ts">
	defineEmits(['cancel'])

async function socketLeaveRoom() {
	// @ts-ignore
	socket.emit("leaveRoom", room.value?.id as Number, userId.value as string)
	window.location.href = "/"
}
</script>

<template>
	<div class="flex flex-col p-10 bg-gray-300 dark:bg-gray-700 rounded-xl gap-4">
        <button @click="$emit('cancel');" class="flex justify-end ">X</button>
        <p class="text-gray-50 text-5xl font-semibold leading-10">User</p>
        <div class="flex flex-row">
            <button @click="socketLeaveRoom" class="bg-blue-800 dark:bg-orange-500 text-white rounded-md p-3 mr-4">Kick Player</button>
            <button class="bg-transparent dark:text-orange-500 border p-3 dark:border-orange-500 border-blue-800 text-blue-800 rounded-md">Promote to Moderator</button>
        </div>

    </div>
</template>