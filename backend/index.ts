import { Socket } from 'socket.io';
import * as express from "express";
import HCServer from './models/HCServer';
import HCRoom from './models/HCRoom';
import HCUser from './models/HCUser';
const cookieParser = require("cookie-parser");

require("dotenv").config();

var expressApp = express()
var http = require('http').Server(expressApp);
var proxy = require('express-http-proxy');
new HCServer(http, expressApp)
HCServer.app.use(cookieParser());

HCServer.app.get("/api/createroom", (req, res) => {
	var room: HCRoom = new HCRoom()

	var user: HCUser | undefined = HCUser.getUserById(req.cookies["_id"])

	if (typeof user == typeof undefined) {
		user = new HCUser
	}

	user!.permissions.host = true
	room.addMember(user!.id)

	res.cookie("_id", user?.id)
	res.send({ room })
})

HCServer.app.get("/api/getroombyid", (req, res) => {
	var id: string = req.query.id as string

	var room: HCRoom = HCRoom.rooms.get(Number.parseInt(id))
	res.send(room)
})

HCServer.app.get("/api/getroommembersstring", (req, res) => {
	var id: string = req.query.id as string

	var room: HCRoom = HCRoom.rooms.get(Number.parseInt(id))
	res.send(room.members)
})

HCServer.app.get("/api/joinRoom", (req, res) => {
	var id: string = req.query.id as string
	var user: HCUser | undefined = HCUser.getUserById(req.cookies["_id"])

	if (typeof user == typeof undefined) {
		user = new HCUser
	}

	var room: HCRoom = HCRoom.rooms.get(Number.parseInt(id))
	room.addMember(user!.id)

	HCServer.io.to(room.id.toString()).emit("roomMemberUpdate", room.getMembersUserArray())

	res.cookie("_id", user?.id)
	res.send({ room })
})
HCServer.app.get("/api/allrooms", (req, res) => {
	res.send(HCRoom.rooms)
})

HCServer.app.get("/api/setname", (req, res) => {
	var name: string = req.query.name as string
	var user: HCUser | undefined = HCUser.getUserById(req.cookies["_id"])

	if (typeof user !== typeof undefined) {
		user!.displayName = name
		if (user?.currentRoom != 0){
			var room: HCRoom = HCRoom.rooms.get(user!.currentRoom)
			HCServer.io.local.to(room.id.toString()).emit("roomMemberUpdate", room.getMembersUserArray())
		}
	}
	res.send()
})

HCServer.app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT || process.env.NITRO_PORT}`));
http.listen(process.env.BACKEND_PORT, function () {
	console.log(`app running on \x1b[43m\x1b[31mhttp://localhost:${process.env.BACKEND_PORT}\x1b[0m`);
});


HCServer.io.on("connect", (socket) => {
	var socketUserId:string
	socket.on("joinSocketRoom", (id: number, userId:string) => {
		if (id == undefined || userId == undefined) {
			return
		}
		socketUserId = userId;
		socket.join(id.toString())
		var room: HCRoom = HCRoom.rooms.get(id)
		if (room == undefined) {
			return
		}
		socket.emit("roomMemberUpdate", room.getMembersUserArray())
	})
	//leaveRoom
	socket.on("leaveRoom", (roomId: number, userId: string) => {
		var room: HCRoom = HCRoom.rooms.get(roomId)
		if (room !== undefined){
			room.removeMember(userId)
			socket.leave(roomId.toString())
		}
	})
	socket.on("disconnect", () => {
		var user:HCUser | undefined = HCUser.getUserById(socketUserId)
		if (typeof user !== typeof undefined){
			if (!user?.permissions.host){
				user?.leaveRoom()
			}
		}
	})
})