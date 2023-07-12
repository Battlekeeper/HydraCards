import * as express from "express";
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"


const router=express.Router()

router.get("/createroom", (req, res) => {
	var room: HCRoom = new HCRoom()

	var user: HCUser | undefined = HCUser.get(req.cookies["_id"])

	if (typeof user == typeof undefined) {
		user = new HCUser
	}

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
	var user: HCUser | undefined = HCUser.get(req.cookies["_id"])

	if (typeof user == typeof undefined) {
		user = new HCUser
	}

	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	room.addMember(user!.id)

	room.emitRoomMemberUpdate()

	res.cookie("_id", user?.id)
	res.send({ room })
})
router.get("/allrooms", (req, res) => {
	res.send(HCRoom.allRooms())
})


module.exports=router;