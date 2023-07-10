import express from 'express';
import socketio from "socket.io";
import http from "http";
import cors from "cors"


const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
	res.send('Hello World!');
  });

const server = http.createServer(app);
const io = new socketio.Server(server, {cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});

server.listen(3001, () =>
  console.log('Backend listening on http://localhost:3001'),
);

io.on("connection", (socket) => {
	console.log(socket.id);
});
io.on("disconnect", (socket) => {
	console.log("Disconnected");
});