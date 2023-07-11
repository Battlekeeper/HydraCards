import { Socket } from 'socket.io';
require("dotenv").config();

var app = require('express')();
var http = require('http').Server(app);
var proxy = require('express-http-proxy');
var io = require('socket.io')(http);

app.use('/', proxy(`http://localhost:${process.env.FRONTEND_PORT || process.env.NITRO_PORT}`));

io.on('connection', function(socket: Socket){
  console.log('a user connected');
});

http.listen(process.env.BACKEND_PORT, function(){
  console.log(`app running on *:${process.env.BACKEND_PORT}`);
});

