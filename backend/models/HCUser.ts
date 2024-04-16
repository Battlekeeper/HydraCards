import { HCVotingStatus } from "./HCVotingStatus"
import { HCRoomPermissions } from "./HCRoomPermissions"
import { generateUserId, randomAvatar } from "../utility"
import { TSMap } from "typescript-map"
import HCRoom from "./HCRoom"

export default class HCUser{
	id: string = ""
	socketId: string = ""
	displayName: string = ""
	currentRoom: number = 0
	userVotingStatus: HCVotingStatus = 0
	permissions: HCRoomPermissions = new HCRoomPermissions
	avatar:string = randomAvatar()
	online:boolean = false
	anonymous:boolean = false
	allowAnon:boolean = false
	focused:boolean = false
	vote:string = ""
	static users:TSMap<string,HCUser> = new TSMap<string,HCUser>
	public static get(id:string){
		return HCUser.users.get(id)
	}
	constructor(){
		this.id = generateUserId()
		HCUser.users.set(this.id, this)
	}
	public leaveRoom(){
		if (this.currentRoom != 0){
			HCRoom.get(this.currentRoom).removeMember(this.id)
		}
	}
	public reset(){
		if (!this.avatar.startsWith("/profile/")){
			this.avatar = randomAvatar()
		}
		this.permissions.host = false;
		this.permissions.admin = false;
		this.userVotingStatus = HCVotingStatus.voting
	}
}