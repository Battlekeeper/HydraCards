import express from 'express';
import socketio from "socket.io";
import http from "http";
import cors from "cors"


const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
	res.send('Hello World!')
  });

const server = http.createServer(app);
const io = new socketio.Server(server, {cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }})

server.listen(3001, () => console.log('\x1b[33mBackend listening on \x1b[96m\x1b[4mhttp://localhost:3001\x1b[0m'))

io.on("connection", (socket) => {
	console.log("Connected: " + socket.id);
	socket.on("disconnect", () => {
		console.log("Disconnected: " + socket.id);
	});
});