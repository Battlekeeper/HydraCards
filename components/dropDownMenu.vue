<script setup lang="ts">


const config = useRuntimeConfig()
const route = useRoute()
const props = defineProps(["inRoom", "inSettings", "roomId"])
const settingsLink = ref("/settings?id=" + props.roomId)
const roomLink = ref("/room?id=" + route.query.id)
const colormode = useColorMode()

const emits = defineEmits(["close", "toggle"])
</script>

<template>
	<div class="z-50 flex flex-col bg-gray-50 dark:bg-gray-900 items-center" style="position: fixed; height:100svh; width:100svw; top:0%; left:0%">
		<div class="flex justify-end w-full p-16 pt-5 pb-0">
			<svg @click="$emit('close')" v-if="colormode.preference == 'dark'" width="42" height="42" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M40.3751 34.4375H17.5989L20.6864 37.5013C21.1336 37.9485 21.3848 38.5551 21.3848 39.1875C21.3848 39.82 21.1336 40.4266 20.6864 40.8738C20.2392 41.321 19.6326 41.5723 19.0001 41.5723C18.3677 41.5723 17.7611 41.321 17.3139 40.8738L10.1889 33.7488C9.97265 33.5229 9.80316 33.2566 9.69012 32.965C9.45258 32.3868 9.45258 31.7383 9.69012 31.16C9.80316 30.8685 9.97265 30.6022 10.1889 30.3763L17.3139 23.2513C17.5347 23.0287 17.7973 22.852 18.0868 22.7314C18.3762 22.6109 18.6866 22.5488 19.0001 22.5488C19.3136 22.5488 19.6241 22.6109 19.9135 22.7314C20.2029 22.852 20.4656 23.0287 20.6864 23.2513C20.909 23.4721 21.0857 23.7348 21.2062 24.0242C21.3268 24.3136 21.3889 24.624 21.3889 24.9375C21.3889 25.2511 21.3268 25.5615 21.2062 25.8509C21.0857 26.1403 20.909 26.403 20.6864 26.6238L17.5989 29.6875H40.3751C41.005 29.6875 41.6091 29.4373 42.0545 28.9919C42.4999 28.5465 42.7501 27.9424 42.7501 27.3125V17.8125C42.7501 17.1827 43.0003 16.5786 43.4457 16.1332C43.8911 15.6878 44.4952 15.4375 45.1251 15.4375C45.755 15.4375 46.3591 15.6878 46.8045 16.1332C47.2499 16.5786 47.5001 17.1827 47.5001 17.8125V27.3125C47.5001 29.2022 46.7495 31.0145 45.4133 32.3507C44.0771 33.6869 42.2648 34.4375 40.3751 34.4375Z" fill="#F7F8F9"/>
			</svg>
			<svg @click="$emit('close')" v-else width="42" height="42" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M40.3751 34.4375H17.5989L20.6864 37.5013C21.1336 37.9485 21.3848 38.5551 21.3848 39.1875C21.3848 39.82 21.1336 40.4266 20.6864 40.8738C20.2392 41.321 19.6326 41.5723 19.0001 41.5723C18.3677 41.5723 17.7611 41.321 17.3139 40.8738L10.1889 33.7488C9.97265 33.5229 9.80316 33.2566 9.69012 32.965C9.45258 32.3868 9.45258 31.7383 9.69012 31.16C9.80316 30.8685 9.97265 30.6022 10.1889 30.3763L17.3139 23.2513C17.5347 23.0287 17.7973 22.852 18.0868 22.7314C18.3762 22.6109 18.6866 22.5488 19.0001 22.5488C19.3136 22.5488 19.6241 22.6109 19.9135 22.7314C20.2029 22.852 20.4656 23.0287 20.6864 23.2513C20.909 23.4721 21.0857 23.7348 21.2062 24.0242C21.3268 24.3136 21.3889 24.624 21.3889 24.9375C21.3889 25.2511 21.3268 25.5615 21.2062 25.8509C21.0857 26.1403 20.909 26.403 20.6864 26.6238L17.5989 29.6875H40.3751C41.005 29.6875 41.6091 29.4373 42.0545 28.9919C42.4999 28.5465 42.7501 27.9424 42.7501 27.3125V17.8125C42.7501 17.1827 43.0003 16.5786 43.4457 16.1332C43.8911 15.6878 44.4952 15.4375 45.1251 15.4375C45.755 15.4375 46.3591 15.6878 46.8045 16.1332C47.2499 16.5786 47.5001 17.1827 47.5001 17.8125V27.3125C47.5001 29.2022 46.7495 31.0145 45.4133 32.3507C44.0771 33.6869 42.2648 34.4375 40.3751 34.4375Z" fill="#2A3342"/>
			</svg>
		</div>
		<div class="flex flex-col justify-center items-center gap-5">
				<img v-show="colormode.preference == 'dark'" src="/images/poker_chip.png" class="w-80" />
				<img v-show="colormode.preference != 'dark'" src="/images/poker_chip_blue.png" class="w-80" />
				<router-link to="/">
					<button class="p-4 w-40 text-white dark:text-white text-lg rounded-md pr-8 pl-8 hover:text-blue-800 hover:bg-white dark:hover:bg-white dark:hover:text-orange-500 shadow bg-blue-800 dark:bg-orange-500 border border-transparent">Home</button>
				</router-link>
				<router-link to="/features">
				<button class="w-40 text-center text-blue-800 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white hover:text-white hover:bg-blue-800 text-lg font-small rounded-md border dark:border-orange-500 px-4 py-2 border-blue-800">Features</button>
				</router-link>
				<router-link to="/aboutUs">
					<button class="w-40 text-center text-blue-800 dark:text-orange-500 dark:hover:bg-orange-500 dark:hover:text-white hover:text-white hover:bg-blue-800 text-lg font-small rounded-md border dark:border-orange-500 px-4 py-2 border-blue-800">About Us</button>
				</router-link>
		</div>
		<button @click="$emit('toggle')" class="mt-16 text-center text-blue-800 dark:text-orange-500 text-xl dark:hover:bg-orange-500 dark:hover:text-white hover:text-white hover:bg-blue-800 font-small rounded-md p-3 border dark:border-orange-500 border-blue-800 w-72">Toggle Light Mode</button>
	</div>
</template>