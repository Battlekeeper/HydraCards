import { v4 as uuidv4 } from "uuid"

export function generateRoomId() {
	let newRoomId: number = Math.floor(Math.random() * 100000000)

	//TODO ACC CHECK THAT ID DOESNT EXIST
	/*
	if (activeRooms.has(newRoomId)) {
		return generateRoomId()
	}
	return newRoomId
	*/
	return newRoomId
}
export function generateUserId() {
	return uuidv4()
}