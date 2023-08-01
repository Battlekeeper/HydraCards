import HCUser from "../backend/models/HCUser"

export default defineNuxtRouteMiddleware(async (to, from) => {
	const id = useCookie("_id").value
	if (id != undefined){
		if (HCUser.get(id) != undefined){
			return navigateTo("/join?id="+to.query.id)
		}
	} else {
		return navigateTo("/join?id="+to.query.id)
	}

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