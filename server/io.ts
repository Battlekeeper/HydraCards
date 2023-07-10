import { Socket, Server } from "socket.io"

export function setIO(io:Socket) { 
	console.log("setIO")
	console.log(io)
 }

// An example svc:
export default function Svc(socket: Socket, io: Server) {
	console.log("SVC Ran")
	return Object.freeze({
	  fn1(msg:string) { 
		console.log(msg)
		return { status: 'ok' }
	  }
	})
}