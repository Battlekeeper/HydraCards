import * as express from "express";
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"
import { HCVotingStatus } from "../../backend/models/HCVotingStatus";


const router=express.Router()

router.get("/createroom", (req, res) => {
	var room: HCRoom = new HCRoom()

	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (user == undefined) {
		user = new HCUser
	}
	
	user?.reset()
	user!.permissions.host = true
	room.addMember(user!.id)

	res.cookie("_id", user?.id)
	res.send({ room })
})

router.get("/getroombyid", (req, res) => {
	var id: string = req.query.id as string

	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	res.send(room)
})

router.get("/getroommembersstring", (req, res) => {
	var id: string = req.query.id as string

	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	res.send(room.members)
})

router.get("/joinRoom", (req, res) => {
	var id: string = req.query.id as string
	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (user == undefined) {
		user = new HCUser
	}

	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room == undefined){
		res.redirect("/")
		return
	}
	user?.reset()
	room.addMember(user!.id)
	room.emitRoomStateUpdate()

	res.cookie("_id", user?.id)
	res.send({ room })
})
router.get("/allrooms", (req, res) => {
	res.send(HCRoom.allRooms())
})


module.exports=router;