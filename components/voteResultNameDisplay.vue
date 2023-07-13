<script setup lang="ts">
import HCUser from "backend/models/HCUser";
import { useRouter } from "vue-router";
const route = useRouter()

const props = defineProps(['vote','userId'])
const { data: user } = await useFetch("http://localhost:3000/api/user/getUserById?id=" + props.userId)
const currentUser = ref(user.value as HCUser)

const hostClass = ref("")

if (currentUser.value.permissions.host)
{
	hostClass.value = "text-red-500"
}

</script>

<template>
	<p :class="hostClass">
		{{currentUser.displayName}} - {{props.vote}}
	</p>
</template>