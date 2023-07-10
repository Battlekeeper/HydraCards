<script>
export default {
	setup() {
	},
	mounted() {
		this.socket = this.$nuxtSocket({
			name: 'home',
			channel: '/',
			reconnection: false
		})
		this.socket.on('connect', async () => {
			console.log("Connected")
		 	var data = await this.socket.emitP('fn1', "This is a message")
			console.log(data)
		})
	}
}
</script>

<template></template>