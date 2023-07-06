import { HCUser, getRoom } from "../plugins/rooms"

export default defineEventHandler((event) => {
	const query = getQuery(event)
	var room = getRoom(query.id as string)
	let user:HCUser = new HCUser
	room.addMember(user)
	return {room, user}
})