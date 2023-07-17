export default defineNuxtRouteMiddleware(async (to, from) => {
	if (to.query.id != undefined) {
		const config = useRuntimeConfig()

		const { data: room } = await useFetch("api/room/getRoomById?id=" + to.query.id, {baseURL: config.public.serverUrl})
		if (typeof room.value != typeof "")
		{
			return;
		}
	}
	return navigateTo("/error?errormsg=Sorry, that room does not exist.")
})