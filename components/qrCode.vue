<script setup land="ts">
import { ref } from 'vue';
import QRCode from 'qrcode'

const root = ref(null)
const props = defineProps(["content", "pagelink", "size"])
const url = ref("")

onMounted(() => {
	if (props.pagelink) {
		QRCode.toDataURL(window.location.href, function (err, newurl) {
			url.value = newurl
		})
	} else {
		QRCode.toDataURL(props.content, function (err, newurl) {
			url.value = newurl
		})
	}

	watch(props, () => {
		if (props.pagelink) {
			QRCode.toDataURL(window.location.href,{type: "image/png", width: 256}, function (err, newurl) {
				url.value = newurl
			})
		} else {
			QRCode.toDataURL(props.content, function (err, newurl) {
				url.value = newurl
			})
		}
	})
})
</script>
<template>
	<img :width="size" :height="size" :src="url">
</template>