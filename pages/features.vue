<script setup lang="ts">
import { ref } from "vue"
import PermenantHeader from '../components/permenantHeader.vue';
const route = useRoute()
</script>



<template>
	<div class="h-screen dark:bg-DarkGrey dark:text-white">
	  <permenantHeader></permenantHeader>
	  <div class="mx-auto text-center text-white text-5xl font-bold leading-10">Why HydraCards?</div>
	  <div class="p-8 mx-auto text-center text-gray-100 text-xl font-medium leading-loose">HydraCards is the best choice for your team on the market for free. So why choose us?</div>
  
	  <div class="grid grid-cols-3 gap-4 ml-16 mt-10 mx-auto">
		<div class="w-96 h-60 bg-slate-600 rounded-md shadow">
		  <div class="w-12 h-12 bg-orange-500 relative -top-5 rounded-full mx-auto border-4 border-slate-800">
			<div class="w-12 relative right-1 text-center text-slate-600 text-xl font-semibold leading-loose">1</div>
		  </div>
		  <div class="w-64 mx-auto text-white text-center text-xl font-bold leading-loose">Save Your Stories</div>
		  <div class="w-72 mx-auto text-gray-100 text-base font-medium leading-normal">With a quick click you’re able to save your past votes on stories to your room.</div>
		</div>
  
		<div class="w-96 h-60 bg-slate-600 rounded-md shadow">
		  <div class="w-12 h-12 bg-orange-500 relative -top-5 rounded-full mx-auto border-4 border-slate-800">
			<div class="w-12 relative right-1 text-center text-slate-600 text-xl font-semibold leading-loose">2</div>
		  </div>
		  <div class="w-64 mx-auto text-white text-center text-xl font-bold leading-loose">Easy To Read Charts</div>
		  <div class="w-72 mx-auto text-gray-100 text-base font-medium leading-normal">Get fast and easy to read data with our charts.</div>
		</div>
  
		<div class="w-96 h-60 bg-slate-600 rounded-md shadow">
		  <div class="w-12 h-12 bg-orange-500 relative -top-5 rounded-full mx-auto border-4 border-slate-800">
			<div class="w-12 relative right-1 text-center text-slate-600 text-xl font-semibold leading-loose">3</div>
		  </div>
		  <div class="w-64 mx-auto text-white text-center text-xl font-bold leading-loose">Easy To Use Mod Controls</div>
		  <div class="w-72 mx-auto text-gray-100 text-base font-medium leading-normal">Our moderator controls are super easy and efficient to use.</div>
		</div>
  
		<div class="w-96 h-60 bg-slate-600 rounded-md shadow">
		  <div class="w-12 h-12 bg-orange-500 relative -top-5 rounded-full mx-auto border-4 border-slate-800">
			<div class="w-12 relative right-1 text-center text-slate-600 text-xl font-semibold leading-loose">4</div>
		  </div>
		  <div class="w-64 mx-auto text-white text-center text-xl font-bold leading-loose">Export Data</div>
		  <div class="w-72 mx-auto text-gray-100 text-base font-medium leading-normal">When you’re done saving your stories you’re able to export all your data to a PDF.</div>
		</div>
  
		<div class="w-96 h-60 bg-slate-600 rounded-md shadow">
		  <div class="w-12 h-12 bg-orange-500 relative -top-5 rounded-full mx-auto border-4 border-slate-800">
			<div class="w-12 relative right-1 text-center text-slate-600 text-xl font-semibold leading-loose">5</div>
		  </div>
		  <div class="w-64 mx-auto text-white text-center text-xl font-bold leading-loose">Its Free!</div>
		  <div class="w-72 mx-auto text-gray-100 text-base font-medium leading-normal">HydraCards is completely free at all times, no hidden charges or fees!</div>
		</div>
	  </div>
	</div>
  </template>
  