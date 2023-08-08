import { delayMs, generateRoomId } from "../utility"
import HCUser from "./HCUser"
import { HCRoomStatus } from "./HCRoomStatus"
import HCSocketIO from "./HCServer"
import { TSMap } from "typescript-map"
import  HCCounter  from "./HCCounter"
import { HCVotingStatus } from "./HCVotingStatus"
import HistoricalVote from "./HistoricalVote"

export default class HCRoom {
	id: number = generateRoomId()
	topicName: string = ""
	members: Array<string> = new Array<string>
	status: HCRoomStatus = 0
	votes: TSMap<string, string> = new TSMap<string, string>
	counter:HCCounter = new HCCounter
	roomCounterEnabled:boolean = false
	revote:boolean = false
	history: Array<HistoricalVote> = new Array<HistoricalVote>
	allowAnonymousMode:boolean = false

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
		if (!HCRoom.rooms.has(this.id)){
			HCRoom.rooms.set(this.id, this)
		}
	}
	public addMember(id:string){
		var user:HCUser = HCUser.get(id) as HCUser

		if (user.currentRoom !== 0){
			let room:HCRoom = HCRoom.get(user.currentRoom);
			room.removeMember(id)
			room.emitRoomStateUpdate()
		}
		this.members.push(id)
		user.currentRoom = this.id
		
		this.emitRoomStateUpdate()
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
			this.emitRoomStateUpdate()
		}
	}
	public setVote(id:string, vote:string)
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
	public emitRoomStateUpdate(){
		var tempRoom:HCRoom = JSON.parse(JSON.stringify(this))
		tempRoom.history.forEach((val) => {
			val.Revotes = new Array<TSMap<string, number>>
		})
		this.getMembersUserArray().forEach(member => {
			member.allowAnon = this.allowAnonymousMode
		});
		HCSocketIO.io.to(this.id.toString()).emit("roomStateUpdate", tempRoom,this.getMembersUserArray())

	}
	public allMembersHaveVoted(){
		return this.getMembersUserArray().filter(member => member.userVotingStatus == HCVotingStatus.voting).length == 0
	}

	public async startCounter(count:number){
		this.counter.count = count
		this.counter.active = true

		while (this.counter.count > 0 && this.counter.active && !this.allMembersHaveVoted())
		{
			await delayMs(1000)
			this.counter.count--
			this.emitRoomStateUpdate()
		}
		this.counter.active = false
		if (this.counter.count == 0 || this.allMembersHaveVoted()){
			this.status = HCRoomStatus.reviewing
			this.emitRoomStateUpdate()
		}
	}
	public async stopCounter(){
		this.counter.count = 0
		this.counter.active = false
	}
}