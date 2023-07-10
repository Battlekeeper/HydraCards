import { getRoom } from "../../modules/socket"

export default defineEventHandler((event) => {
	const query = getQuery(event)
	return getRoom(query.id as string)
})