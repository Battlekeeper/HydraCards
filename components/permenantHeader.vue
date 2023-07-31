<script setup lang="ts">
import qrCode from "../components/qrCode.vue";
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
import Toggle from '@vueform/toggle'
//@ts-ignore
import Cookies from "js-cookie"


const props = defineProps(["inRoom"])

const config = useRuntimeConfig()
const selectedTheme = ref(true)
const colormode = useColorMode()
colormode.preference = "light"
const theme = useCookie("theme", { default: () => ("light") })
colormode.preference = theme.value

if (colormode.preference != "light" && colormode.preference != "dark")
{
	colormode.preference = "light"
	Cookies.set('theme', colormode.preference)
}

if (colormode.preference == "light") {
	selectedTheme.value = false
} else {
	selectedTheme.value = true
}

function toggleDark() {
	if (colormode.preference == "light") {
		colormode.preference = "dark"
	} else {
		colormode.preference = "light"
	}
	Cookies.set('theme', colormode.preference)
}

const showQRCodeModal = ref(false)

</script>

<template>
	<div class="flex bg-slate-50 dark:bg-DarkGrey items-center pl-16 pr-16 pt-5">
		<router-link to="/">
			<div class="flex w-[15em]">
				<img v-show="colormode.preference == 'dark'" src="@/images/poker_chip.png" style="width: 40px; height: 39px"
					class="" />
				<img v-show="colormode.preference != 'dark'" src="@/images/poker_chip_blue.png"
					style="width: 40px; height: 39px" class="" />
				<p class="text-black dark:text-slate-50 text-2xl font-bold">HydraCards</p>
			</div>
		</router-link>

		<div v-if="!props.inRoom" class="flex justify-center grow">
			<router-link to="/aboutUs"
				class="py-2 px-5 text-black dark:text-gray-100 text-base font-medium leading-normal">About Us</router-link>
			<router-link to="/features"
				class="py-2 px-5 text-black dark:text-gray-100 text-base font-medium leading-normal">Features</router-link>
		</div>
		<div class="flex w-[15em] justify-end">
			<Toggle v-if="!props.inRoom" @change="toggleDark();" offLabel="light" onLabel="dark" v-model="selectedTheme"/>
		</div>

		<div v-if="props.inRoom" class="flex justify-center grow">
			<Toggle @change="toggleDark();" offLabel="light" onLabel="dark" v-model="selectedTheme" />
		</div>
		<div v-if="props.inRoom">
			<div class="flew">
				<button @click="showQRCodeModal = !showQRCodeModal" class="w-28 h-9">
					<span class="dark:text-slate-50 text-black text-sm font-medium">Show QR Code</span>
				</button>
				<div v-show="showQRCodeModal" @click="showQRCodeModal = false">
					<ModalPopup>
						<qrCode :size="256" :pagelink="true"></qrCode>
					</ModalPopup>
				</div>
				<button>
					<span class="text-orange-500 text-m font-medium">⚙︎ Settings</span>
				</button>
			</div>
		</div>
	</div>
</template>