import { HCVotingStatus } from "./HCVotingStatus"
import { HCRoomPermissions } from "./HCRoomPermissions"
import { generateUserId } from "../utility"
import { TSMap } from "typescript-map"

export default class HCUser{
	id: string = generateUserId()
	socketId: string = ""
	displayName: string = ""
	currentRoom: number = 0
	userStatus: HCVotingStatus = 0
	permissions: HCRoomPermissions = new HCRoomPermissions
	static users:TSMap<string,HCUser> = new TSMap<string,HCUser>

	constructor(){
		HCUser.users.set(this.id, this)
	}

	public static getUserById(id:string | undefined)
	{
		if (typeof id == typeof undefined){
			return undefined
		}
		return HCUser.users.get(id as string)
	}
}