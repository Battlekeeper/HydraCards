<script setup>
import ErrorMessageComp from "../components/errorMessage.vue";

const route = useRoute()
const errorMessage = ref("There has been an error! Please try again.")
if (route.query.errormsg != undefined){
	errorMessage.value = route.query.errormsg
}

function returnHome(){
	window.location.href='/'
}
</script>

<template>
	<ErrorMessageComp>{{errorMessage}}</ErrorMessageComp>
    <button @click="returnHome()" class="px-5 py-2 m-5 hover:bg-red-700 text-white bg-red-500 rounded-lg">Return Home</button>
</template>

