<script setup lang="ts">
const route = useRoute()
</script>

<template>
	<div class="h-full dark:bg-DarkGrey dark:text-gray-100 text-black">
		<permenantHeader></permenantHeader>
		<div class="mx-auto text-center text-5xl font-bold leading-10 mt-[38px]">Why HydraCards?</div>
		<div class="p-8 mx-auto text-center text-xl font-medium leading-loose">HydraCards is the best choice for your team
			on the market for free. So why choose us?</div>
		<div class="dark:text-gray-100 flex flex-col items-center">
			<div class="grid grid-cols-3 gap-8 mt-8">
				<div class="w-96 h-60 rounded-md shadow dark:bg-gray-700 bg-gray-300">
					<div
						class="w-12 h-12 dark:bg-orange-500 bg-blue-800 relative -top-5 rounded-full mx-auto border-4 border-slate-50 dark:border-DarkGrey">
						<div
							class="w-12 relative right-1 text-gray-100 dark:text-gray-700 text-center text-xl font-semibold leading-loose">
							1</div>
					</div>
					<div class="w-64 mx-auto relative -left-4 text-xl font-bold leading-loose">Save Your Stories</div>
					<div class="w-72 mx-auto text-base font-medium relative top-8 leading-normal">With a quick click you are
						able to save your past votes on stories to your room.</div>
				</div>

				<div class="w-96 h-60 rounded-md dark:bg-gray-700 bg-gray-300 shadow">
					<div
						class="w-12 h-12 dark:bg-orange-500 bg-blue-800 relative -top-5 rounded-full mx-auto border-4 border-slate-50 dark:border-DarkGrey">
						<div
							class="w-12 relative right-1 text-center text-gray-100 dark:text-gray-700 text-xl font-semibold leading-loose">
							2</div>
					</div>
					<div class="w-64 mx-auto text-xl relative -left-4 font-bold leading-loose">Easy To Read Charts</div>
					<div class="w-72 mx-auto text-base font-medium relative top-8 leading-normal">Get fast and easy to read
						data with our charts.</div>
				</div>

				<div class="w-96 h-60 rounded-md dark:bg-gray-700 bg-gray-300 shadow">
					<div
						class="w-12 h-12 dark:bg-orange-500 bg-blue-800 relative -top-5 rounded-full mx-auto border-4 border-slate-50 dark:border-DarkGrey">
						<div
							class="w-12 relative right-1 text-center text-xl font-semibold text-gray-100 dark:text-gray-700 leading-loose">
							3</div>
					</div>
					<div class="w-64 mx-auto text-xl font-bold relative -left-4 leading-loose">Easy To Use Mod Controls
					</div>
					<div class="w-72 mx-auto text-base font-medium relative top-8 leading-normal">Our moderator controls are
						super easy and efficient to use.</div>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-8 mt-10 w-fit">
				<div class="w-96 h-60 rounded-md dark:bg-gray-700 bg-gray-300 shadow">
					<div
						class="w-12 h-12 dark:bg-orange-500 bg-blue-800 relative -top-5 rounded-full mx-auto border-4 border-slate-50 dark:border-DarkGrey">
						<div
							class="w-12 relative right-1 text-center text-xl font-semibold text-gray-100 dark:text-gray-700 leading-loose">
							4</div>
					</div>
					<div class="w-64 mx-auto text-xl font-bold relative -left-4 leading-loose">Export Data</div>
					<div class="w-72 mx-auto text-base font-medium relative top-8 leading-normal">When you are done saving
						your stories you are able to export all your data to a PDF.</div>
				</div>

				<div class="w-96 h-60 rounded-md dark:bg-gray-700 bg-gray-300 shadow">
					<div
						class="w-12 h-12 dark:bg-orange-500 bg-blue-800 relative -top-5 rounded-full mx-auto border-4 border-slate-50 dark:border-DarkGrey">
						<div
							class="w-12 relative right-1 text-center text-xl font-semibold text-gray-100 dark:text-gray-700 leading-loose">
							5</div>
					</div>
					<div class="w-64 mx-auto text-xl font-bold relative -left-4 leading-loose">It Is Free!</div>
					<div class="w-72 mx-auto text-base font-medium relative top-8 leading-normal">HydraCards is completely
						free at all times, no hidden charges or fees!</div>
				</div>
			</div>
		</div>
	</div>
</template>