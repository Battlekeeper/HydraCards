import { Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

require("dotenv").config();

var app = require('express')();
var http = require('http').Server(app);
var proxy = require('express-http-proxy');
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

app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT || process.env.NITRO_PORT}`));

io.on('connection', function (socket: Socket) {
	console.log('a user connected');
});

http.listen(process.env.BACKEND_PORT, function () {
	console.log(`app running on http://localhost:${process.env.BACKEND_PORT}`);
});