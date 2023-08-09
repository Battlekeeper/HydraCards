import * as express from "express"
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"
import { HCVotingStatus } from "../../backend/models/HCVotingStatus"
import * as papa from "papaparse"
import { TSMap } from "typescript-map";

const router = express.Router()

router.get("/createroom", (req, res) => {
	var room: HCRoom = new HCRoom()

	var user: HCUser = HCUser.get(req.cookies["_id"])

	if (user == undefined) {
		user = new HCUser
	}

	user?.reset()
	user!.permissions.host = true
	room.addMember(user!.id)
	room.topicName = req.query.topicName as string
	room.counter.count = Number.parseInt(req.query.timer as string)
	if (req.query.timerEnabled as string == "true" || req.query.timerEnabled as string == "True"){
		room.roomCounterEnabled = true
	} else {
		room.roomCounterEnabled = false
	}
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
	var spectatorMode:string = req.query.spectatorMode as string

	if (user == undefined) {
		user = new HCUser
	}

	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room == undefined) {
		res.redirect("/")
		return
	}
	user?.reset()
	room.addMember(user!.id)
	room.emitRoomStateUpdate()

	if (spectatorMode == "true") {
		user.userVotingStatus = HCVotingStatus.spectating
	}
	res.cookie("_id", user?.id)
	res.send({ room })
})
router.get("/allrooms", (req, res) => {
	res.send(HCRoom.allRooms())
})
router.get("/history", (req, res) => {
	var id: string = req.query.id as string
	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room != undefined) {
		res.send(room.history)
	} else {
		res.send()
	}
})

router.get("/setTimerActive", (req, res) => {
	var id: string = req.query.id as string
	var enabled:string = req.query.enabled as string
	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room != undefined) {
		if (enabled == "true"){
			room.roomCounterEnabled = true
		} else {
			room.roomCounterEnabled = false
		}
		room.emitRoomStateUpdate()
	}
})

router.get("/allowAnonymous", (req, res) => {
	var id: string = req.query.id as string
	var enabled:string = req.query.enabled as string
	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room != undefined) {
		if (enabled == "true"){
			room.allowAnonymousMode = true
		} else {
			room.allowAnonymousMode = false
		}
		room.emitRoomStateUpdate()
	}
})


router.get("/csv", (req, res) => {
	var id: string = req.query.id as string
	var topic: string = req.query.topic as string
	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room != undefined) {

		var data: Array<Object> = new Array<Object> 
		room.history[Number.parseInt(topic)].Revotes.forEach((map:TSMap<string, number>, index:number) => {
			Object.keys(map).forEach((key:string) => {
				var voteObj = {
					revoteNumber: index,
					name: HCUser.get(key as string).displayName,
					vote: Object.values(map)[Object.keys(map).findIndex(k => k==key)]
				}
				data.push(voteObj)
			})
		})

		const csv = papa.unparse(data, {
			header: true
		});
		res.write(csv)
	}
	res.send()
})

router.get("/kickuser", (req, res) => {
	var id: string = req.query.id as string
	var user = HCUser.get(id)
	var room = HCRoom.get(user.currentRoom)

	if (user != undefined && room != undefined){
		room.kickuser(user)
	}

	res.send()
})
router.get("/promote", (req, res) => {
	var id: string = req.query.id as string
	var promote:string = req.query.promote as string
	var user = HCUser.get(id)
	var room = HCRoom.get(user.currentRoom)

	if (user != undefined && room != undefined){
		user.userVotingStatus = HCVotingStatus.voting
		if (promote == "true"){
			user.permissions.host = true
		} else {
			user.permissions.host = false
		}
		room.emitRoomStateUpdate()
	}

	res.send()
})

module.exports = router;