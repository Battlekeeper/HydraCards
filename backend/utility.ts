import { v4 as uuidv4 } from "uuid"
import HCRoom from "./models/HCRoom"

export function generateRoomId() {
	let newRoomId: number = Math.floor(Math.random() * 100000000)
	if (newRoomId < 10000000){
		newRoomId *= 10
	}

	if (HCRoom.rooms.has(newRoomId)){
		return generateRoomId()
	}
	
	return newRoomId
}
export function generateUserId() {
	return uuidv4()
}