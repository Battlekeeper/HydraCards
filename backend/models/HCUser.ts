import { HCVotingStatus } from "./HCVotingStatus"
import { HCRoomPermissions } from "./HCRoomPermissions"
import { generateUserId } from "../utility"

export default class HCUser{
	id: string = generateUserId()
	socketId: string = ""
	displayName: string = ""
	currentRoom: number = 0
	userStatus: HCVotingStatus = 0
	permissions: HCRoomPermissions = new HCRoomPermissions
}