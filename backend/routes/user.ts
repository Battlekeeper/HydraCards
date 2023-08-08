import * as express from "express";
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"
import { HCVotingStatus } from "../models/HCVotingStatus";
import { deleteAllFilesWithName } from "../utility";


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
router.get("/setAnonymousMode", (req, res) => {
	var enabled: string = req.query.enabled as string
	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (user != undefined){
		if(enabled == "true"){
			user.anonymous = true
		} else {
			user.anonymous = false
		}
		HCRoom.get(user.currentRoom).emitRoomStateUpdate()
	}
	res.send()
})
router.get("/getUserById", (req, res) => {
	var id: string = req.query.id as unknown as string
	var user: HCUser = HCUser.get(id)
	res.send(user)
})

router.post("/profileupload", (req, res) => {
	//@ts-ignore
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}
	var user: HCUser = HCUser.get(req.cookies["_id"])
	if (user != undefined && HCRoom.get(user.currentRoom) != undefined){
		//@ts-ignore
		var filename:string = user.id + "." + (req.files.profileImage.name as string).split(".").slice(-1)[0];
		user.avatar = "/profile/" + filename
		deleteAllFilesWithName(user.id,'public/profile/')
		//@ts-ignore
		req.files.profileImage.mv("public/profile/" + filename)
		HCRoom.get(user.currentRoom).emitRoomStateUpdate()
	}
})


module.exports=router;
