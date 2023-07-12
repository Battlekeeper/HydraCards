import { generateRoomId } from "../utility"
import HCUser from "./HCUser"
import { HCRoomStatus } from "./HCRoomStatus"
import HCSocketIO from "./HCServer"
import { TSMap } from "typescript-map"
import { io } from "socket.io-client"

export default class HCRoom {
	id: number = generateRoomId()
	topicName: string = ""
	members: Array<string> = new Array<string>
	status: HCRoomStatus = 0
	static rooms:TSMap<number, HCRoom> = new TSMap<number, HCRoom>

	constructor() {
		HCRoom.rooms.set(this.id, this)
	}

	public addMember(id:string){
		var user:HCUser = HCUser.getUserById(id) as HCUser

		if (user.currentRoom !== 0){
			let room:HCRoom = HCRoom.rooms.get(user.currentRoom);
			room.removeMember(id)
			HCSocketIO.io.local.to(room.id.toString()).emit("roomMemberUpdate", room.getMembersUserArray())
		}
		this.members.push(id)
		user.currentRoom = this.id
		
		HCSocketIO.io.local.to(this.id.toString()).emit("roomMemberUpdate", this.getMembersUserArray())
	}
	public removeMember(id:string){
		var user:HCUser = HCUser.getUserById(id) as HCUser

		if (user.currentRoom !== 0){
			this.members = this.members.filter(usr => usr !== id);
			user.currentRoom = 0
            if (user.permissions.host === true){
				if (this.members.length > 0){
					HCUser.getUserById(this.members[0])!.permissions.host = true
				} else {
                    HCRoom.rooms.delete(this.id)
                }
			}
			HCSocketIO.io.to(this.id.toString()).emit("roomMemberUpdate", this.getMembersUserArray())
		}
	}
	public getMembersUserArray(){
		var users:Array<HCUser> = new Array<HCUser>
		this.members.forEach(id => {
			users.push(HCUser.getUserById(id) as HCUser)
		});
		return users
	}
}