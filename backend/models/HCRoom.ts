import { generateRoomId } from "../utility"
import HCUser from "./HCUser"
import { HCRoomStatus } from "./HCRoomStatus"
import HCSocketIO from "./HCServer"
import { TSMap } from "typescript-map"

export default class HCRoom {
	id: number = generateRoomId()
	topicName: string = ""
	members: Array<string> = new Array<string>
	status: HCRoomStatus = 0
	votes: TSMap<string, number> = new TSMap<string, number>
	private static rooms:TSMap<number, HCRoom> = new TSMap<number, HCRoom>

	public static get(id:number){
		return HCRoom.rooms.get(id)
	}
	public static exists(id:number){
		return HCRoom.rooms.has(id)
	}
	public static allRooms(){
		return HCRoom.rooms;
	}

	constructor() {
		HCRoom.rooms.set(this.id, this)
	}
	public addMember(id:string){
		var user:HCUser = HCUser.get(id) as HCUser

		if (user.currentRoom !== 0){
			let room:HCRoom = HCRoom.get(user.currentRoom);
			room.removeMember(id)
			room.emitRoomMemberUpdate()
		}
		this.members.push(id)
		user.currentRoom = this.id
		
		this.emitRoomMemberUpdate()
	}
	public removeMember(id:string){
		var user:HCUser = HCUser.get(id) as HCUser

		if (user.currentRoom !== 0){
			this.members = this.members.filter(usr => usr !== id);
			user.currentRoom = 0
            if (user.permissions.host === true){
				if (this.members.length > 0){
					HCUser.get(this.members[0])!.permissions.host = true
				} else {
                    HCRoom.rooms.delete(this.id)
                }
			}
			user.permissions.host = false
			this.emitRoomMemberUpdate()
		}
	}
	public setVote(id:string, vote:number)
	{
		this.votes.set(id, vote)
	}
	public getMembersUserArray(){
		var users:Array<HCUser> = new Array<HCUser>
		this.members.forEach(id => {
			users.push(HCUser.get(id) as HCUser)
		});
		return users
	}
	public emitRoomMemberUpdate(){
		HCSocketIO.io.to(this.id.toString()).emit("roomMemberUpdate", this.getMembersUserArray())
	}
}