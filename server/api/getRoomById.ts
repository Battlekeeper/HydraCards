import { getRoom } from "../plugins/rooms";

export default defineEventHandler((event) => {
	const query = getQuery(event)
	return getRoom(query.id as string)
})