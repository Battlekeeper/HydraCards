<script setup lang="ts">
import qrCode from "../components/qrCode.vue";
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";

const showQRCodeModal = ref(false)
const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const userId: Ref<string> = ref(useCookie('_id').value as string)

function isInRoom() {
	const roomExists = currentRoom.value != undefined
	const userExists = currentUser.value != undefined
	const userInRoom = currentRoom.value?.members.findIndex((id) => userId.value == id) != -1
	console.log(userInRoom)
	if (roomExists && userExists && userInRoom) {
		return true
	}
	return false
}
console.log(isInRoom())
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
		<!--v-if="isInRoom()"-->
		<div class="flex">
			<button @click="showQRCodeModal = !showQRCodeModal" class="w-28 h-9">
				<span class="text-white text-sm font-medium absolute right-48 top-6">Show QR Code</span>
			</button>
			<div v-show="showQRCodeModal" @click="showQRCodeModal = false">
				<ModalPopup><qrCode :size="256" :pagelink="true"></qrCode></ModalPopup>
			</div>

			<button>
				<span class="text-orange-500 text-m font-medium absolute right-16 top-6">⚙︎ Settings</span>
			</button>
			
			<!--show current room id?-->
		</div>
		
	</div>
</template>