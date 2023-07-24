<script setup lang="ts">

</script>

<template>
	<div class="flex">
		<router-link to="/" >
			<div class="flex pt-4">
				<img src="@/logos/poker_chip.png" alt="My Image" style="width: 40px; height: 39px"/>
				<p class="text-xl font-bold leading-8">HydraCards</p>
			</div>
		</router-link>
		<div class="justify-evenly items-center w-full lg:flex">
			<router-link to="/aboutUs" class="button block py-2 border-b">About Us</router-link>
			<router-link to="/features" class="button block py-2 border-b">Features</router-link>
			<router-link to="/settings" class="button block py-2 border-b">Settings</router-link>
		</div>
	</div>
</template>