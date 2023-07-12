import * as express from "express";
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"


const router=express.Router()

router.get("/setname", (req, res) => {
	var name: string = req.query.name as string
	var user: HCUser | undefined = HCUser.get(req.cookies["_id"])

	if (typeof user !== typeof undefined) {
		user!.displayName = name
		if (user?.currentRoom != 0){
			var room: HCRoom = HCRoom.get(user!.currentRoom)
			room.emitRoomMemberUpdate()
		}
	}
	res.send()
})

module.exports=router;
