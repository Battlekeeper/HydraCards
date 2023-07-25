<script setup lang="ts">

</script>

<template>
	<div class="flex dark:bg-DarkGrey">
		<router-link to="/" >
			<div class="flex pt-4
			">
				<img src="@/logos/poker_chip.png" alt="My Image" style="width: 40px; height: 39px" class="ml-32"/>
				<p class="text-white text-2xl font-bold">HydraCards</p>
			</div>
		</router-link>
		<div class="py-3 px-80 items-center w-full flex">
			<router-link to="/aboutUs" class="py-2 px-5 text-gray-100 text-base font-medium leading-normal">About Us</router-link>
			<router-link to="/features" class="py-2 px-5 text-gray-100 text-base font-medium leading-normal">Features</router-link>
			<router-link to="/settings" class="py-2 px-5 text-gray-100 text-base font-medium leading-normal">Settings</router-link>
		</div>
		
	</div>
</template>