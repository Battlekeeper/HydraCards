import { defineNuxtModule } from '@nuxt/kit'
import { Server, Socket } from 'socket.io'
//const { instrument } = require("@socket.io/admin-ui");
import {instrument} from "@socket.io/admin-ui"
import JSONdb from 'simple-json-db'
import { v4 as uuidv4 } from 'uuid';


let io: Server

console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_")
console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_")
console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_")


export default defineNuxtModule({
	setup(options, nuxt) {
		nuxt.hook('listen', (server) => {
			console.log('Socket listen', server.address(), server.eventNames())

			io = new Server(server, {
				cors: {
					origin: ["https://admin.socket.io"],
					credentials: true
				}
			})
			//https://admin.socket.io/#/
			instrument(io, {
				auth: {
					type: "basic",
					username: "admin",
					password: "$2a$12$QhnvivG8actfqZaISb2Hs.DPAaej/gDuYsMN/ZKUthn1SRkbqiFPq" // "password" encrypted with bcrypt (https://bcrypt-generator.com/)
				},
			});

			nuxt.hook('close', () => io.close())
			io.on("connect", (socket) => {
				socket.on("joinSocketRoom", (roomId:string)=> {
					socket.join(roomId);
				})
				socket.on("leaveSocketRoom", (roomId:string)=> {
					socket.leave(roomId);
				})
				
				socket.on("syncUserSocketId", (user:HCUser, roomId:string)=> {
					/*
					console.log(user)
					let room:HCRoom = getRoom(roomId)
					user.socketId = socket.id
					room.members[room.members.findIndex((usr:HCUser) => {usr === user})] = user
					room.update()
					*/
				})
				
			})
		})
	}
})


export enum HCVotingStatus {
	voting, //0
	spectating, //1
	voted //2
}

export class HCUser {
	id: string = generateUserId()
	socketId: string = ""
	displayName: string = ""
	currentRoom: string = ""
	userStatus: HCVotingStatus = 0
	permissions: HCRoomPermissions = new HCRoomPermissions
}

export class HCRoomPermissions{
	host:boolean = false
}

export enum HCRoomStatus {
	voting,
	reviewing
}
export class HCRoom {
	id: string = generateRoomId()
	topicName: string = ""
	members: Array<HCUser> = new Array<HCUser>
	status: HCRoomStatus = 0

	public addMember(user:HCUser){
		if (user.currentRoom !== ""){
			let room:HCRoom = db.get(user.currentRoom);
			room.removeUser(user)
			room.update()
		}
		this.members.push(user)
		user.currentRoom = this.id
		this.update()
	}
	public removeUser(user:HCUser){
		if (user.currentRoom !== ""){
			this.members = this.members.filter(usr => usr.id !== user.id);
			user.currentRoom = ""
			this.update()
		}
	}
	public update(){
		db.set(this.id, this)
	}
}
const activeRooms: Map<string, HCRoom> = new Map<string, HCRoom>()
const db = new JSONdb('database.json');


export function generateRoomId() {
	let newRoomId: string = Math.floor(Math.random() * 1000000000) as unknown as string //Ex: 28504231
	if (activeRooms.has(newRoomId)) {
		return generateRoomId()
	}
	return newRoomId
}
export function generateUserId() {
	return uuidv4()
}
export function createRoom() {
	let newRoom: HCRoom = new HCRoom()
	db.set(newRoom.id, newRoom)
	return newRoom
}
export function closeRoom(room: HCRoom) {
	//TODO: take a look at later
	db.delete(room.id)
}
export function joinRoom(user: HCUser, joinRoomId:string) {
	//activeRooms.get(joinRoomId)?.members.set(user.id, user)
	//TODO: Replace
}
export function getRoom(roomId:string){
	return db.get(roomId)
}
