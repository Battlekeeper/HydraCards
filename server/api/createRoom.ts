import { HCUser, createRoom } from "../../modules/socket"

export default defineEventHandler((event) => {
	var room = createRoom()
	let user:HCUser = new HCUser
	user.permissions.host = true
	room.addMember(user)
	return {room, user}
})