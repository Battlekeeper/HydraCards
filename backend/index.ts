import { Socket } from 'socket.io';
import * as express from "express";
import HCServer from './models/HCServer';
import HCRoom from './models/HCRoom';
import HCUser from './models/HCUser';
import { HCVotingStatus } from './models/HCVotingStatus';
import { HCRoomStatus } from './models/HCRoomStatus';
const userRouter = require("./routes/user")
const roomRouter = require("./routes/room")



const cookieParser = require("cookie-parser");

require("dotenv").config();

var expressApp = express()
var http = require('http').Server(expressApp);
var proxy = require('express-http-proxy');
new HCServer(http, expressApp)
HCServer.app.use(cookieParser());

HCServer.app.use("/api/user", userRouter)
HCServer.app.use("/api/room", roomRouter)


HCServer.app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT || process.env.NITRO_PORT}`));
http.listen(process.env.BACKEND_PORT, function () {
	console.log(`app running on \x1b[43m\x1b[31mhttp://localhost:${process.env.BACKEND_PORT}\x1b[0m`);
});


HCServer.io.on("connect", (socket) => {
	var socketUserId:string
	socket.on("joinSocketRoom", (roomId: number, userId:string) => {
		var user = HCUser.get(userId)
		var room: HCRoom = HCRoom.get(roomId)

		if (roomId == undefined || userId == undefined || user == undefined || room == undefined) {
			return
		}
		
		socketUserId = user.id;
		socket.join(roomId.toString())
		
		room.emitRoomStateUpdate()
	})
	//leaveRoom
	socket.on("leaveRoom", (roomId: number, userId: string) => {
		var room: HCRoom = HCRoom.get(roomId)
		if (room !== undefined){
			room.removeMember(userId)
			socket.leave(roomId.toString())
		}
	})
	/*
	socket.on("disconnect", () => {
		var user:HCUser | undefined = HCUser.get(socketUserId)
		if (typeof user !== typeof undefined){
			if (!user?.permissions.host){
				user?.leaveRoom()
			}
		}
	})
	*/
	socket.on("submitVote", (roomId:number, userId: string, vote:number) => {
		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser | undefined= HCUser.get(userId);
		if (room == undefined || user == undefined){
			return
		}
		room.setVote(userId, vote)
		user!.userVotingStatus = HCVotingStatus.voted
		room.emitRoomStateUpdate()
	})
	socket.on("displayResults", (roomId:number, userId:string) =>{

		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser|undefined = HCUser.get(userId)

		if (room == undefined || user == undefined){
			return
		}

		if (!user.permissions.host){
			return
		}
		room.status = HCRoomStatus.reviewing
		room.emitRoomStateUpdate()

	})
	socket.on("revote", (roomId:number, userId:string) => {

		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser|undefined = HCUser.get(userId)

		if (room == undefined || user == undefined){
			return
		}

		if (!user.permissions.host){
			return
		}
		room.status = HCRoomStatus.voting
		room.votes.clear()
		room.getMembersUserArray().forEach(member => {
			if (member.userVotingStatus == HCVotingStatus.voted){
				member.userVotingStatus = HCVotingStatus.voting
			}
		});
		room.emitRoomStateUpdate()

	})
	socket.on("broadcastRoomStateUpdate", (roomId: number) => {
		var room:HCRoom = HCRoom.get(roomId)
		if (room != undefined){
			room.emitRoomStateUpdate()
		}
	})
})