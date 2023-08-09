import { Socket } from 'socket.io';
import * as express from "express";
import HCServer from './models/HCServer';
import HCRoom from './models/HCRoom';
import HCUser from './models/HCUser';
import { HCVotingStatus } from './models/HCVotingStatus';
import { HCRoomStatus } from './models/HCRoomStatus';
import * as fs from 'fs';
import * as path from 'path';
import HistoricalVote from './models/HistoricalVote';

var cors = require('cors');
const userRouter = require("./routes/user")
const roomRouter = require("./routes/room")


const cookieParser = require("cookie-parser");

require("dotenv").config();

var expressApp = express()
var http = require('http').Server(expressApp);
var proxy = require('express-http-proxy');
const fileUpload = require('express-fileupload');
new HCServer(http, expressApp)
HCServer.app.use(cookieParser());
HCServer.app.use(cors({
	origin: process.env.BASE_URL,
	optionsSuccessStatus: 200,
	credentials:true
}))
HCServer.app.use(fileUpload())

HCServer.app.use("/api/user", userRouter)
HCServer.app.use("/api/room", roomRouter)

//HCServer.app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT}`));
http.listen(process.env.BACKEND_PORT, function () {
	console.log(`API running on \x1b[43m\x1b[31mhttp://localhost:${process.env.BACKEND_PORT}\x1b[0m`);
	console.log(`APP running on \x1b[43m\x1b[31mhttp://localhost:${process.env.FRONTEND_PORT}\x1b[0m`);

});

fs.mkdir("public/profile", (err:any) => {})

fs.readdir("public/profile", (err, files) => {
	if (files != undefined){
		files.forEach((file:any) => {
			const filePath = path.join("public/profile", file);
			fs.unlink(filePath, (err:any) => {});
		});
	}
});

HCServer.io.on("connect", (socket) => {
	var socketUserId:string

	socket.on("disconnect", () => {
		var user:HCUser = HCUser.get(socketUserId)
		if (user != undefined){
			user.online = false
			var room:HCRoom = HCRoom.get(user.currentRoom)
			if (room != undefined){
				room.emitRoomStateUpdate()
			}
		}
	})
	socket.on("setSocketId", (userId:string)=>{
		socketUserId = userId
	})
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
	socket.on("submitVote", (roomId:number, userId: string, vote:string) => {
		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser = HCUser.get(userId);
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
		room.members.forEach((userId:string) => {
			if (!room.votes.has(userId)){
				room.votes.set(userId, "")
			}
		});


		room.status = HCRoomStatus.reviewing
		room.emitRoomStateUpdate()

	})
	socket.on("revote", (roomId:number, userId:string, revote:boolean, points:number) => {

		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser|undefined = HCUser.get(userId)

		if (room == undefined || user == undefined){
			return
		}

		if (!user.permissions.host){
			return
		}
		room.status = HCRoomStatus.voting
		room.revote = revote
		if (room.history.length == 0)
		{
			room.history.push(new HistoricalVote)
		}
		var HistoricalVoteData:HistoricalVote = room.history[room.history.length - 1]
		HistoricalVoteData.TopicName = room.topicName
		HistoricalVoteData.Points = points
		HistoricalVoteData.Revotes.push(JSON.parse(JSON.stringify(room.votes)))

		if (!revote){
			room.counter.count = 0
			room.history.push(new HistoricalVote)
		}

		room.votes.clear()
		room.getMembersUserArray().forEach(member => {
			if (member.userVotingStatus == HCVotingStatus.voted){
				member.userVotingStatus = HCVotingStatus.voting
			}
		});
		room.emitRoomStateUpdate()
	})
	socket.on("coffeebreak", (roomId:number, userId:string, enabled:boolean) => {
		var room:HCRoom = HCRoom.get(roomId)
		var user:HCUser|undefined = HCUser.get(userId)

		if (room == undefined || user == undefined){
			return
		}

		if (!user.permissions.host){
			return
		}

		if (enabled){
			room.status = HCRoomStatus.coffeebreak
		} else {
			room.status = HCRoomStatus.voting
		}
		room.emitRoomStateUpdate()
	})
	socket.on("broadcastRoomStateUpdate", (roomId: number) => {
		var room:HCRoom = HCRoom.get(roomId)
		if (room != undefined){
			room.emitRoomStateUpdate()
		}
	})
	socket.on("setMemberName", (roomId:number, userId:string, name:string) => {
		var user:HCUser = HCUser.get(userId);

		if (user !== undefined) {
			user!.displayName = name
			if (user?.currentRoom != 0){
				var room: HCRoom = HCRoom.get(roomId)
				room.emitRoomStateUpdate()
			}
		}
	})
	socket.on("setRoomTopicName",(roomId:number, userId:string, topicName:string) => {
		var user:HCUser = HCUser.get(userId);
		var room:HCRoom = HCRoom.get(roomId)
		
		if (typeof user !== typeof undefined && room !== undefined){
			if (user.permissions.host){
				room.topicName = topicName
				room.emitRoomStateUpdate()
			}
		}
	})
	socket.on("startCount",(roomId:number, userId:string, count:number) => {
		var user:HCUser = HCUser.get(userId);
		var room:HCRoom = HCRoom.get(roomId)
		
		if (typeof user !== typeof undefined && room !== undefined){
			if (user.permissions.host){
				room.startCounter(count)
				room.emitRoomStateUpdate()
			}
		}
	})
	socket.on("onlinePing", (userId:string) => {
		var user:HCUser = HCUser.get(userId)
		if (user != undefined){
			if (user.online){
				user.online = true
			} else {
				user.online = true
				var room:HCRoom = HCRoom.get(user.currentRoom)
				if (room != undefined){
					room.emitRoomStateUpdate()
				}
			}
			
		}
	})
})