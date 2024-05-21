require("dotenv").config();
import { defineNuxtConfig } from 'nuxt/config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	
	runtimeConfig: {
		// Will be available in both server and client
		public: {
			socketUrl: '',
			baseUrl: process.env.BASE_URL
		},
	},
	devServer: {
		port: parseInt(process.env.FRONTEND_PORT || "3001"),
	},
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'nuxt-vue3-google-signin'
	],
	colorMode: {
		classSuffix: ''
	},
	googleSignIn: {
		clientId: 'CLIENT ID OBTAINED FROM GOOGLE API CONSOLE',
	  },
	router: {
		//@ts-ignore
		middleware: ['nullroomredirect'],
	},
	ssr: false
})
