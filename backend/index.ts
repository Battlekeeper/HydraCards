import { Socket } from 'socket.io';
import * as express from "express";
import HCServer from './models/HCServer';
import HCRoom from './models/HCRoom';
import HCUser from './models/HCUser';

require("dotenv").config();

var app = express()
var http = require('http').Server(app);
var proxy = require('express-http-proxy');
new HCServer(http, app)


HCServer.app.get("/api/createroom", (req, res) => {
	var room:HCRoom = new HCRoom()
	var user:HCUser = new HCUser
	user.permissions.host = true
	room.addMember(user)
	res.send({room, user})
})

HCServer.app.get("/api/getroombyid", (req, res) => {
	var id:string = req.query.id as string

	var room:HCRoom = HCRoom.rooms.get(Number.parseInt(id))
	res.send(room)
})

HCServer.app.get("/api/joinRoom", (req, res) => {
	var id:string = req.query.id as string
	var room:HCRoom = HCRoom.rooms.get(Number.parseInt(id))
	var user:HCUser = new HCUser
	room.addMember(user)
	res.send({room, user})
})

app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT || process.env.NITRO_PORT}`));
http.listen(process.env.BACKEND_PORT, function () {
	console.log(`app running on http://localhost:${process.env.BACKEND_PORT}`);
});

