<script setup lang="ts">
import joinError from "../components/joinError.vue"
import HCRoom from "../backend/models/HCRoom"

const showCreateRoomPrompt = ref(false)
const showJoinRoomPrompt = ref(false)
const colormode = useColorMode()
const roomCode = ref(null)
const joinErrorPrompt = ref(false)
const config = useRuntimeConfig()

async function checkIfCanJoin(){
	
	var response = await useFetch("api/room/getroombyid?id=" + roomCode.value, { credentials: "include", baseURL: config.public.baseUrl })
	var room:HCRoom = response.data.value as HCRoom
	if (room.id == undefined){
		joinErrorPrompt.value = true
	} else {
		showJoinRoomPrompt.value = true
	}
}

</script>


<template>
	<PermenantHeader></PermenantHeader>
	<p class="text-black dark:text-slate-50 text-5xl font-bold mt-10 lg:ml-60 md:ml-16">Joining a Room</p>
	<p class="text-black dark:text-slate-400 text-xl font-normal mt-5 lg:ml-60 md:ml-16">Get a code from the host and input it here.</p>
	<div class="flex w-full justify-center mt-7">
		<div class="bg-gray-300 dark:bg-gray-700 rounded-md lg:w-[360px] md:w-64 mr-4" style="aspect-ratio: 1/1.4066;">
			<div class="flex flex-col items-center">
				<p class="text-center text-blue-800 dark:text-orange-500 text-xl font-medium mt-[86px] w-[295px] h-[30px] ml-[32px] mr-[32px]">
					Join Room</p>
				<h1 class="text-center text-black dark:text-slate-50 text-3xl font-semibold mt-[11px]">Room Code</h1>
				<input text="number" class="text-slate-800 text-base font-normal leading-normal mt-[11px] p-2 rounded-md"
					placeholder="Enter Code Here" v-model="roomCode">
				<div class="w-full pl-8">
					<div class="flex mt-[42px]">
						<svg v-if="colormode.preference == 'dark'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_21403)">
								<g clip-path="url(#clip0_2942_21403)">
									<circle cx="13" cy="12" r="9.375" fill="#F16523" stroke="#B34333" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00846C18.5142 7.93035 18.4221 7.86836 18.3205 7.82605C18.219 7.78374 18.11 7.76196 18 7.76196C17.89 7.76196 17.7811 7.78374 17.6796 7.82605C17.578 7.86836 17.4858 7.93035 17.4084 8.00846L11.2 14.2251L8.59171 11.6085C8.51127 11.5308 8.41632 11.4697 8.31227 11.4287C8.20823 11.3877 8.09713 11.3676 7.98531 11.3695C7.87349 11.3714 7.76315 11.3954 7.66058 11.4399C7.55802 11.4845 7.46524 11.5489 7.38754 11.6293C7.30984 11.7097 7.24875 11.8047 7.20774 11.9087C7.16674 12.0128 7.14663 12.1239 7.14856 12.2357C7.1505 12.3475 7.17444 12.4579 7.21902 12.5604C7.2636 12.663 7.32794 12.7558 7.40837 12.8335L10.6084 16.0335C10.6858 16.1116 10.778 16.1736 10.8796 16.2159C10.9811 16.2582 11.09 16.28 11.2 16.28C11.3101 16.28 11.419 16.2582 11.5205 16.2159C11.6221 16.1736 11.7142 16.1116 11.7917 16.0335L18.5917 9.23346C18.6763 9.15543 18.7438 9.06072 18.79 8.9553C18.8361 8.84988 18.86 8.73605 18.86 8.62096C18.86 8.50588 18.8361 8.39204 18.79 8.28662C18.7438 8.18121 18.6763 8.0865 18.5917 8.00846Z"
								fill="#333F51" />
							<defs>
								<filter id="filter0_d_2942_21403" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_21403" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_21403"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_21403">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<svg v-else="colormode.preference == 'light'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_23674)">
								<g clip-path="url(#clip0_2942_23674)">
									<circle cx="13" cy="12" r="9.375" fill="#2255BE" stroke="#132E68" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00822C18.5142 7.93011 18.4221 7.86811 18.3205 7.82581C18.219 7.7835 18.11 7.76172 18 7.76172C17.89 7.76172 17.7811 7.7835 17.6796 7.82581C17.578 7.86811 17.4858 7.93011 17.4084 8.00822L11.2 14.2249L8.59171 11.6082C8.51127 11.5305 8.41632 11.4694 8.31227 11.4284C8.20823 11.3874 8.09713 11.3673 7.98531 11.3692C7.87349 11.3712 7.76315 11.3951 7.66058 11.4397C7.55802 11.4843 7.46524 11.5486 7.38754 11.6291C7.30984 11.7095 7.24875 11.8044 7.20774 11.9085C7.16674 12.0125 7.14663 12.1236 7.14856 12.2354C7.1505 12.3473 7.17444 12.4576 7.21902 12.5602C7.2636 12.6627 7.32794 12.7555 7.40837 12.8332L10.6084 16.0332C10.6858 16.1113 10.778 16.1733 10.8796 16.2156C10.9811 16.2579 11.09 16.2797 11.2 16.2797C11.3101 16.2797 11.419 16.2579 11.5205 16.2156C11.6221 16.1733 11.7142 16.1113 11.7917 16.0332L18.5917 9.23322C18.6763 9.15518 18.7438 9.06047 18.79 8.95506C18.8361 8.84964 18.86 8.7358 18.86 8.62072C18.86 8.50563 18.8361 8.3918 18.79 8.28638C18.7438 8.18096 18.6763 8.08625 18.5917 8.00822Z"
								fill="#D5DAE1" />
							<defs>
								<filter id="filter0_d_2942_23674" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_23674" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_23674"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_23674">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						Join And Vote
					</div>
					<div class="flex mt-[12px]">
						<svg v-if="colormode.preference == 'dark'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_21403)">
								<g clip-path="url(#clip0_2942_21403)">
									<circle cx="13" cy="12" r="9.375" fill="#F16523" stroke="#B34333" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00846C18.5142 7.93035 18.4221 7.86836 18.3205 7.82605C18.219 7.78374 18.11 7.76196 18 7.76196C17.89 7.76196 17.7811 7.78374 17.6796 7.82605C17.578 7.86836 17.4858 7.93035 17.4084 8.00846L11.2 14.2251L8.59171 11.6085C8.51127 11.5308 8.41632 11.4697 8.31227 11.4287C8.20823 11.3877 8.09713 11.3676 7.98531 11.3695C7.87349 11.3714 7.76315 11.3954 7.66058 11.4399C7.55802 11.4845 7.46524 11.5489 7.38754 11.6293C7.30984 11.7097 7.24875 11.8047 7.20774 11.9087C7.16674 12.0128 7.14663 12.1239 7.14856 12.2357C7.1505 12.3475 7.17444 12.4579 7.21902 12.5604C7.2636 12.663 7.32794 12.7558 7.40837 12.8335L10.6084 16.0335C10.6858 16.1116 10.778 16.1736 10.8796 16.2159C10.9811 16.2582 11.09 16.28 11.2 16.28C11.3101 16.28 11.419 16.2582 11.5205 16.2159C11.6221 16.1736 11.7142 16.1116 11.7917 16.0335L18.5917 9.23346C18.6763 9.15543 18.7438 9.06072 18.79 8.9553C18.8361 8.84988 18.86 8.73605 18.86 8.62096C18.86 8.50588 18.8361 8.39204 18.79 8.28662C18.7438 8.18121 18.6763 8.0865 18.5917 8.00846Z"
								fill="#333F51" />
							<defs>
								<filter id="filter0_d_2942_21403" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_21403" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_21403"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_21403">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<svg v-else="colormode.preference == 'light'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_23674)">
								<g clip-path="url(#clip0_2942_23674)">
									<circle cx="13" cy="12" r="9.375" fill="#2255BE" stroke="#132E68" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00822C18.5142 7.93011 18.4221 7.86811 18.3205 7.82581C18.219 7.7835 18.11 7.76172 18 7.76172C17.89 7.76172 17.7811 7.7835 17.6796 7.82581C17.578 7.86811 17.4858 7.93011 17.4084 8.00822L11.2 14.2249L8.59171 11.6082C8.51127 11.5305 8.41632 11.4694 8.31227 11.4284C8.20823 11.3874 8.09713 11.3673 7.98531 11.3692C7.87349 11.3712 7.76315 11.3951 7.66058 11.4397C7.55802 11.4843 7.46524 11.5486 7.38754 11.6291C7.30984 11.7095 7.24875 11.8044 7.20774 11.9085C7.16674 12.0125 7.14663 12.1236 7.14856 12.2354C7.1505 12.3473 7.17444 12.4576 7.21902 12.5602C7.2636 12.6627 7.32794 12.7555 7.40837 12.8332L10.6084 16.0332C10.6858 16.1113 10.778 16.1733 10.8796 16.2156C10.9811 16.2579 11.09 16.2797 11.2 16.2797C11.3101 16.2797 11.419 16.2579 11.5205 16.2156C11.6221 16.1733 11.7142 16.1113 11.7917 16.0332L18.5917 9.23322C18.6763 9.15518 18.7438 9.06047 18.79 8.95506C18.8361 8.84964 18.86 8.7358 18.86 8.62072C18.86 8.50563 18.8361 8.3918 18.79 8.28638C18.7438 8.18096 18.6763 8.08625 18.5917 8.00822Z"
								fill="#D5DAE1" />
							<defs>
								<filter id="filter0_d_2942_23674" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_23674" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_23674"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_23674">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						See Saved Stories
					</div>
				</div>
				<button @click="checkIfCanJoin()"
					class="text-blue-800 dark:text-orange-500 hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white bg-gray-300 dark:bg-gray-700 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px] lg:mt-24 md:mt-5 md:mb-5">
					Join Room
				</button>
			</div>
		</div>
		<div class="bg-gray-300 dark:bg-gray-700 rounded-md ml-4 lg:w-[360px] md:w-64" style="aspect-ratio: 1/1.4066;">
			<div class="flex flex-col items-center">
				<p
					class="text-center text-blue-800 dark:text-orange-500 text-xl font-medium mt-[86px] w-[295px] h-[30px] ml-[32px] mr-[32px]">
					Host Temporary Room</p>
				<img v-if="colormode.preference == 'dark'" class="w-24 mt-6" src="/images/server_icon_white.png" />
				<img v-else="colormode.preference == 'light'" class="w-24 mt-6" src="/images/server_icon_black.png" />

				<div class="w-full pl-8">
					<div class="flex mt-[24px]">
						<svg v-if="colormode.preference == 'dark'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_21403)">
								<g clip-path="url(#clip0_2942_21403)">
									<circle cx="13" cy="12" r="9.375" fill="#F16523" stroke="#B34333" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00846C18.5142 7.93035 18.4221 7.86836 18.3205 7.82605C18.219 7.78374 18.11 7.76196 18 7.76196C17.89 7.76196 17.7811 7.78374 17.6796 7.82605C17.578 7.86836 17.4858 7.93035 17.4084 8.00846L11.2 14.2251L8.59171 11.6085C8.51127 11.5308 8.41632 11.4697 8.31227 11.4287C8.20823 11.3877 8.09713 11.3676 7.98531 11.3695C7.87349 11.3714 7.76315 11.3954 7.66058 11.4399C7.55802 11.4845 7.46524 11.5489 7.38754 11.6293C7.30984 11.7097 7.24875 11.8047 7.20774 11.9087C7.16674 12.0128 7.14663 12.1239 7.14856 12.2357C7.1505 12.3475 7.17444 12.4579 7.21902 12.5604C7.2636 12.663 7.32794 12.7558 7.40837 12.8335L10.6084 16.0335C10.6858 16.1116 10.778 16.1736 10.8796 16.2159C10.9811 16.2582 11.09 16.28 11.2 16.28C11.3101 16.28 11.419 16.2582 11.5205 16.2159C11.6221 16.1736 11.7142 16.1116 11.7917 16.0335L18.5917 9.23346C18.6763 9.15543 18.7438 9.06072 18.79 8.9553C18.8361 8.84988 18.86 8.73605 18.86 8.62096C18.86 8.50588 18.8361 8.39204 18.79 8.28662C18.7438 8.18121 18.6763 8.0865 18.5917 8.00846Z"
								fill="#333F51" />
							<defs>
								<filter id="filter0_d_2942_21403" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_21403" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_21403"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_21403">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<svg v-else="colormode.preference == 'light'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_23674)">
								<g clip-path="url(#clip0_2942_23674)">
									<circle cx="13" cy="12" r="9.375" fill="#2255BE" stroke="#132E68" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00822C18.5142 7.93011 18.4221 7.86811 18.3205 7.82581C18.219 7.7835 18.11 7.76172 18 7.76172C17.89 7.76172 17.7811 7.7835 17.6796 7.82581C17.578 7.86811 17.4858 7.93011 17.4084 8.00822L11.2 14.2249L8.59171 11.6082C8.51127 11.5305 8.41632 11.4694 8.31227 11.4284C8.20823 11.3874 8.09713 11.3673 7.98531 11.3692C7.87349 11.3712 7.76315 11.3951 7.66058 11.4397C7.55802 11.4843 7.46524 11.5486 7.38754 11.6291C7.30984 11.7095 7.24875 11.8044 7.20774 11.9085C7.16674 12.0125 7.14663 12.1236 7.14856 12.2354C7.1505 12.3473 7.17444 12.4576 7.21902 12.5602C7.2636 12.6627 7.32794 12.7555 7.40837 12.8332L10.6084 16.0332C10.6858 16.1113 10.778 16.1733 10.8796 16.2156C10.9811 16.2579 11.09 16.2797 11.2 16.2797C11.3101 16.2797 11.419 16.2579 11.5205 16.2156C11.6221 16.1733 11.7142 16.1113 11.7917 16.0332L18.5917 9.23322C18.6763 9.15518 18.7438 9.06047 18.79 8.95506C18.8361 8.84964 18.86 8.7358 18.86 8.62072C18.86 8.50563 18.8361 8.3918 18.79 8.28638C18.7438 8.18096 18.6763 8.08625 18.5917 8.00822Z"
								fill="#D5DAE1" />
							<defs>
								<filter id="filter0_d_2942_23674" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_23674" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_23674"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_23674">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						Edit Story Names
					</div>
					<div class="flex mt-[12px]">
						<svg v-if="colormode.preference == 'dark'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_21403)">
								<g clip-path="url(#clip0_2942_21403)">
									<circle cx="13" cy="12" r="9.375" fill="#F16523" stroke="#B34333" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00846C18.5142 7.93035 18.4221 7.86836 18.3205 7.82605C18.219 7.78374 18.11 7.76196 18 7.76196C17.89 7.76196 17.7811 7.78374 17.6796 7.82605C17.578 7.86836 17.4858 7.93035 17.4084 8.00846L11.2 14.2251L8.59171 11.6085C8.51127 11.5308 8.41632 11.4697 8.31227 11.4287C8.20823 11.3877 8.09713 11.3676 7.98531 11.3695C7.87349 11.3714 7.76315 11.3954 7.66058 11.4399C7.55802 11.4845 7.46524 11.5489 7.38754 11.6293C7.30984 11.7097 7.24875 11.8047 7.20774 11.9087C7.16674 12.0128 7.14663 12.1239 7.14856 12.2357C7.1505 12.3475 7.17444 12.4579 7.21902 12.5604C7.2636 12.663 7.32794 12.7558 7.40837 12.8335L10.6084 16.0335C10.6858 16.1116 10.778 16.1736 10.8796 16.2159C10.9811 16.2582 11.09 16.28 11.2 16.28C11.3101 16.28 11.419 16.2582 11.5205 16.2159C11.6221 16.1736 11.7142 16.1116 11.7917 16.0335L18.5917 9.23346C18.6763 9.15543 18.7438 9.06072 18.79 8.9553C18.8361 8.84988 18.86 8.73605 18.86 8.62096C18.86 8.50588 18.8361 8.39204 18.79 8.28662C18.7438 8.18121 18.6763 8.0865 18.5917 8.00846Z"
								fill="#333F51" />
							<defs>
								<filter id="filter0_d_2942_21403" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_21403" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_21403"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_21403">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<svg v-else="colormode.preference == 'light'" width="26" height="26" viewBox="0 0 26 26" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<g filter="url(#filter0_d_2942_23674)">
								<g clip-path="url(#clip0_2942_23674)">
									<circle cx="13" cy="12" r="9.375" fill="#2255BE" stroke="#132E68" stroke-width="1.25" />
								</g>
							</g>
							<path
								d="M18.5917 8.00822C18.5142 7.93011 18.4221 7.86811 18.3205 7.82581C18.219 7.7835 18.11 7.76172 18 7.76172C17.89 7.76172 17.7811 7.7835 17.6796 7.82581C17.578 7.86811 17.4858 7.93011 17.4084 8.00822L11.2 14.2249L8.59171 11.6082C8.51127 11.5305 8.41632 11.4694 8.31227 11.4284C8.20823 11.3874 8.09713 11.3673 7.98531 11.3692C7.87349 11.3712 7.76315 11.3951 7.66058 11.4397C7.55802 11.4843 7.46524 11.5486 7.38754 11.6291C7.30984 11.7095 7.24875 11.8044 7.20774 11.9085C7.16674 12.0125 7.14663 12.1236 7.14856 12.2354C7.1505 12.3473 7.17444 12.4576 7.21902 12.5602C7.2636 12.6627 7.32794 12.7555 7.40837 12.8332L10.6084 16.0332C10.6858 16.1113 10.778 16.1733 10.8796 16.2156C10.9811 16.2579 11.09 16.2797 11.2 16.2797C11.3101 16.2797 11.419 16.2579 11.5205 16.2156C11.6221 16.1733 11.7142 16.1113 11.7917 16.0332L18.5917 9.23322C18.6763 9.15518 18.7438 9.06047 18.79 8.95506C18.8361 8.84964 18.86 8.7358 18.86 8.62072C18.86 8.50563 18.8361 8.3918 18.79 8.28638C18.7438 8.18096 18.6763 8.08625 18.5917 8.00822Z"
								fill="#D5DAE1" />
							<defs>
								<filter id="filter0_d_2942_23674" x="0.5" y="0.75" width="25" height="25"
									filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix in="SourceAlpha" type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
									<feOffset dy="1.25" />
									<feGaussianBlur stdDeviation="1.25" />
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
									<feBlend mode="normal" in2="BackgroundImageFix"
										result="effect1_dropShadow_2942_23674" />
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2942_23674"
										result="shape" />
								</filter>
								<clipPath id="clip0_2942_23674">
									<rect x="3" y="2" width="20" height="20" rx="10" fill="white" />
								</clipPath>
							</defs>
						</svg>
						Moderator Tools
					</div>
				</div>
				<button @click="showCreateRoomPrompt = !showCreateRoomPrompt"
					class="text-blue-800 hover:text-white hover:bg-blue-800 dark:hover:bg-orange-500 dark:hover:text-white dark:text-orange-500 bg-gray-300 dark:bg-gray-700 p-2 rounded-md border border-blue-800 dark:border-orange-500 text-base font-medium leading-normal w-[160px] lg:mt-24 md:mt-5 md:mb-5">
					Create Room
				</button>
			</div>
		</div>
	</div>
	<div v-show="showCreateRoomPrompt">
		<ModalPopup @close="showCreateRoomPrompt=false;">
			<CreateRoomPrompt @cancel="showCreateRoomPrompt=false;" :pagelink="true"></CreateRoomPrompt>
		</ModalPopup>
	</div>
	<div v-show="showJoinRoomPrompt">
		<ModalPopup @close="showJoinRoomPrompt=false;">
			<JoinRoomPrompt :roomId="roomCode" :pagelink="true"></JoinRoomPrompt>
		</ModalPopup>
	</div>
	<ModalPopup v-if="joinErrorPrompt"  @close="joinErrorPrompt=false;">
		<joinError @cancel="joinErrorPrompt=false;"></joinError>
	</ModalPopup>
</template>