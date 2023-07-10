// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'nuxt-socket-io',
	],
	io: {
		sockets: [
			{
				name: "home",
				url: 'http://localhost:3000',
				default: true
			}
		]
	}
})