export enum HCVotingStatus {
	voting, //0
	spectating, //1
	voted //2
}

export class HCUser {
	id: string = ""
	socketId: string = ""
	displayName: string = ""
	currentRoom: string = ""
	userStatus: HCVotingStatus = 0
}

export enum HCRoomStatus {
	voting,
	reviewing
}

export class HCRoom {
	id: string = generateRoomId()
	topicName: string = ""
	members: Map<string, HCUser> = new Map<string, HCUser>
	status: HCRoomStatus = 0
}

export const activeRooms: Map<string, HCRoom> = new Map<string, HCRoom>

export function generateRoomId() {
	let newRoomId: string = Math.floor(Math.random() * 1000000000) as unknown as string //Ex: 28504231
	if (activeRooms.has(newRoomId)) {
		return generateRoomId()
	}
	return newRoomId
}

export function createRoom() {
	let newRoom: HCRoom = new HCRoom()
	activeRooms.set(newRoom.id, newRoom)
	return newRoom
}

export function closeRoom(room: HCRoom) {
	activeRooms.delete(room.id)
}

export function joinRoom(user: HCUser, joinRoomId:string) {
	//TODO: check if it exisits
	activeRooms.get(joinRoomId)?.members.set(user.id, user)
}