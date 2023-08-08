import HCUser from "../backend/models/HCUser"

export default defineNuxtRouteMiddleware(async (to, from) => {
	const id = useCookie("_id")
	const config = useRuntimeConfig()

	if (id != undefined){
		const { data: user } = await useFetch(`api/user/getUserById?id=` + id.value, { baseURL: config.public.serverUrl })
		if (user.value != undefined){
			//@ts-ignore
			if (user.value.currentRoom != Number.parseInt(to.query.id as string)){
				return navigateTo("/join?id="+to.query.id)
			}
		} else {
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