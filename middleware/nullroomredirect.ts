export default defineNuxtRouteMiddleware(async (to, from) => {
	const id = useCookie("_id")
	const config = useRuntimeConfig()

	if (id != undefined){
		try{
		//const { data: user } = await useFetch(`api/user/getUserById?id=` + id.value, { baseURL: config.public.apiUrl })
		const response = await fetch(config.public.apiUrl + `/api/user/getUserById?id=` + id.value)
		const user = await response.json()

		if (user != undefined){
			//@ts-ignore
			if (user.currentRoom != Number.parseInt(to.query.id as string)){
				return navigateTo("/join?id="+to.query.id)
			}
		} else {
			return navigateTo("/join?id="+to.query.id)
		}
	} catch {
		return navigateTo("/join?id="+to.query.id)
	}
	} else {
		return navigateTo("/join?id="+to.query.id)
	}

	if (to.query.id != undefined) {
		const config = useRuntimeConfig()

		const { data: room } = await useFetch("api/room/getRoomById?id=" + to.query.id, {baseURL: config.public.apiUrl})
		if (typeof room.value != typeof "")
		{
			return;
		}
	}
	return navigateTo("/error?errormsg=Sorry, that room does not exist.")
})