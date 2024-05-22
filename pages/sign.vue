<script setup lang="ts">
import PermenantHeader from '../components/permenantHeader.vue';
import { ref } from "vue"

const colormode = useColorMode()
import { useOneTap, type CredentialResponse } from "vue3-google-signin";

useOneTap({
  onSuccess: (response: CredentialResponse) => {
    console.log("Success:", response);
  },
  onError: () => console.error("Error with One Tap Login"),
  // options
});
const route = useRoute()
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  console.log("Access Token", credential);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
</script>

<template>
    <permenantHeader></permenantHeader>
    <div class="flex flex-col items-center justify-center mt-[38px]">
		<h1 class="text-4xl font-bold mb-[16px]">HydraCards</h1>
		<p class="text-center text-xl font-semibold pb-[54px]">Sign In Please</p>
		<p class="md:w-[554px] w-[250px] text-center text-lg font-small pb-[6px]"><GoogleSignInButton
    @success="handleLoginSuccess"
    @error="handleLoginError"
  ></GoogleSignInButton></p>
		<img v-show="colormode.preference == 'dark'" class="w-96 h-auto"
			src="/images/poker_chip.png" />
		<img v-show="colormode.preference != 'dark'" class="w-96 h-auto"
			src="/images/poker_chip_blue.png" />
	</div>
  
</template>