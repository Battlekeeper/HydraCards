import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { Express } from "express";

export default class HCServer{
	static io:Server
	static app:Express
	constructor(http: any, app:Express) {
		var io = require('socket.io')(http, {
			cors: {
				origin: ["https://admin.socket.io"],
				credentials: true
			}
		});
		instrument(io, {
			auth: {
				type: "basic",
				username: "admin",
				password: "$2a$12$QhnvivG8actfqZaISb2Hs.DPAaej/gDuYsMN/ZKUthn1SRkbqiFPq" // "password" encrypted with bcrypt (https://bcrypt-generator.com/)
			},
		});
		HCServer.io = io
		HCServer.app = app
	  }
}