<script setup lang="ts">
import { useRouter } from "vue-router";

const route = useRouter()
const props = defineProps(['cardId', "selectedCard", "userVotingStatus"])
const selectedStyle = ref("w-44 h-24 rotate-90 bg-gray-300 dark:bg-slate-600 rounded-xl shadow hover:bg-orange-500")
const cardDisabled = ref(props.userVotingStatus == 1)

onMounted(()=>{
	watch(props, () => {
		if (props.cardId == props.selectedCard) {
			selectedStyle.value = "w-44 h-24 rotate-90 bg-gray-300 dark:bg-slate-600 rounded-xl shadow hover:bg-orange-500 border-4 border-indigo-600"
		} else {
			selectedStyle.value = "w-44 h-24 rotate-90 bg-gray-300 dark:bg-slate-600 rounded-xl shadow hover:bg-orange-500"
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
	<div class="w-20 h-44 p-8">
	  <button :disabled=cardDisabled :class="selectedStyle">
		<div class="w-8 h-8 p-16 text-black dark:text-slate-50 text-xl -rotate-90 font-semibold leading-loose">
			<slot />
		</div>
	</button>
	</div>
</template>