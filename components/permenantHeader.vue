<script setup lang="ts">

</script>

<template>
	<div class="flex dark:bg-DarkGrey">
		<router-link to="/" >
			<div class="flex pt-4">
				<img src="@/logos/poker_chip.png" alt="My Image" style="width: 40px; height: 39px"/>
				<p class="text-xl font-bold leading-8 dark:text-white">HydraCards</p>
			</div>
		</router-link>
		<div class="justify-evenly items-center w-full flex">
			<router-link to="/aboutUs" class="py-2 dark:text-white">About Us</router-link>
			<router-link to="/features" class=" py-2 dark:text-white">Features</router-link>
			<router-link to="/settings" class="block py-2 dark:text-white">Settings</router-link>
		</div>
		
	</div>
</template>