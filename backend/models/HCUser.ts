import { HCVotingStatus } from "./HCVotingStatus"
import { HCRoomPermissions } from "./HCRoomPermissions"
import { generateUserId } from "../utility"
import { TSMap } from "typescript-map"
import HCRoom from "./HCRoom"

export default class HCUser{
	id: string = generateUserId()
	socketId: string = ""
	displayName: string = ""
	currentRoom: number = 0
	userVotingStatus: HCVotingStatus = 0
	permissions: HCRoomPermissions = new HCRoomPermissions
	private static users:TSMap<string,HCUser> = new TSMap<string,HCUser>
	public static get(id:string){
		if (typeof id == typeof undefined){
			return undefined
		}
		return HCUser.users.get(id)
	}
	constructor(){
		HCUser.users.set(this.id, this)
	}
	public leaveRoom(){
		if (this.currentRoom != 0){
			HCRoom.get(this.currentRoom).removeMember(this.id)
		}
	}
	public reset(){
		this.permissions.host = false;
		this.userVotingStatus = HCVotingStatus.voting
	}
}