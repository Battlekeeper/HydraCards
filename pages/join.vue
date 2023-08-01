<script setup lang="ts">
import { ref } from "vue"
const route = useRouter()
const joinCode = ref("")
const config = useRuntimeConfig()
joinCode.value = route.currentRoute.value.query.id as string

</script>

<template>
<PermenantHeader></PermenantHeader>
<div class="absolute top-1/2 left-1/2 flex justify-center items-center" style="transform: translate(-50%,-50%);">
	<JoinRoomPrompt :room-id="joinCode"></JoinRoomPrompt>
</div>
</template>