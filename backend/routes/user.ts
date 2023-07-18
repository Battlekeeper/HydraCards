import * as express from "express";
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"
import { HCVotingStatus } from "../models/HCVotingStatus";


const router=express.Router()

router.get("/setname", (req, res) => {
	var name: string = req.query.name as string
	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (user !== undefined) {
		user!.displayName = name
		if (user?.currentRoom != 0){
			var room: HCRoom = HCRoom.get(user!.currentRoom)
			room.emitRoomStateUpdate()
		}
	}
	res.send()
})


router.get("/setspectatormode", (req, res) => {
	var mode: string = req.query.mode as unknown as string
	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (mode != undefined && user != undefined) {
		if (user?.currentRoom != 0){
			var room: HCRoom = HCRoom.get(user!.currentRoom)

			if (mode == "true") {
				user!.userVotingStatus = HCVotingStatus.spectating
				room.votes.delete(user.id)
			} else {
				user!.userVotingStatus = HCVotingStatus.voting
			}
			room.emitRoomStateUpdate()
		}
	}
	res.send()
})

router.get("/getUserById", (req, res) => {
	var id: string = req.query.id as unknown as string
	var user: HCUser = HCUser.get(id)
	res.send(user)
})



module.exports=router;
