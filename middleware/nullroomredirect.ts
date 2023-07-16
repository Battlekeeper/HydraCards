export default defineNuxtRouteMiddleware(async (to, from) => {
	if (to.query.id != undefined) {
		const { data: room } = await useFetch("http://localhost:3000/api/room/getRoomById?id=" + to.query.id )
		if (typeof room.value != typeof "")
		{
			return;
		}
	}
	return navigateTo("/")
})