import { defineNuxtModule } from '@nuxt/kit'
import { Server, Socket } from 'socket.io'

const { instrument } = require("@socket.io/admin-ui");

let io: Server

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
				/*
				socket.on("syncUserSocketId", (user:HCUser, roomId:string)=> {
					console.log(user)
					let room:HCRoom = getRoom(roomId)
					user.socketId = socket.id
					room.members[room.members.findIndex((usr:HCUser) => {usr === user})] = user
					room.update()
				})
				*/
			})
		})
	}
})