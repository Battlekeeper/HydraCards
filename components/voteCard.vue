<script setup lang="ts">
import { useRouter } from "vue-router";

const route = useRouter()
const props = defineProps(['cardId', "selectedCard", "userVotingStatus"])
const selectedStyle = ref("text-white h-40 w-20 bg-sky-500 hover:bg-sky-700 border-none px-5 py-2 m-5 rounded-lg cursor-pointer")
const cardDisabled = ref(props.userVotingStatus == 1)

onMounted(()=>{
	watch(props, () => {
		if (props.cardId == props.selectedCard) {
			selectedStyle.value = "px-5 py-2 m-5 rounded-lg rounded-lg cursor-pointer text-white h-40 w-20 bg-sky-500 hover:bg-sky-700 border-4 border-indigo-600"
		} else {
			selectedStyle.value = "text-white h-40 w-20 bg-sky-500 hover:bg-sky-700 border-none px-5 py-2 m-5 rounded-lg cursor-pointer"
		}
		if (props.userVotingStatus == 1){
			cardDisabled.value = true
		} else {
			cardDisabled.value = false
		}
})
})


</script>

<template>
	<button :disabled=cardDisabled :class="selectedStyle">
		<slot />
	</button>
</template>