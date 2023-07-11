import { generateRoomId } from "../utility"
import HCUser from "./HCUser"
import { HCRoomStatus } from "./HCRoomStatus"
import HCSocketIO from "./HCServer"
import { TSMap } from "typescript-map"
import { root } from "postcss"

export default class HCRoom {
	id: number = generateRoomId()
	topicName: string = ""
	members: Array<HCUser> = new Array<HCUser>
	status: HCRoomStatus = 0
	static rooms:TSMap<number, HCRoom> = new TSMap<number, HCRoom>

	constructor() {
		HCRoom.rooms.set(this.id, this)
	}

	public addMember(user:HCUser){
		if (user.currentRoom !== 0){
			let room:HCRoom = HCRoom.rooms.get(user.currentRoom);
			room.removeMember(user)
		}
		this.members.push(user)
		user.currentRoom = this.id
		
		HCSocketIO.io.local.to(this.id.toString()).emit("roomMemberUpdate", this.members)
	}
	public removeMember(user:HCUser){
		if (user.currentRoom !== 0){
			this.members = this.members.filter(usr => usr.id !== user.id);
			user.currentRoom = 0
			HCSocketIO.io.to(this.id.toString()).emit("roomMemberUpdate", this.members)
		}
	}
}