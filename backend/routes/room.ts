import * as express from "express"
import HCRoom from "../models/HCRoom"
import HCUser from "../models/HCUser"
import { HCVotingStatus } from "../../backend/models/HCVotingStatus"
import * as papa from "papaparse"
import { TSMap } from "typescript-map";
import HistoricalVote from "backend/models/HistoricalVote"
import {authenticateToken, generateAccessToken, authenticateOrCreateToken} from "../auth/auth"

const router = express.Router()

router.get("/createroom", authenticateOrCreateToken, (req, res) => {
	let room: HCRoom = new HCRoom()

	let user: HCUser | undefined = req.user
	if (user == undefined) {
		user = new HCUser
		let jwtToken = generateAccessToken(user.id);
		res.cookie("token", jwtToken)
		res.cookie("_id", user.id)
	}

	user.reset()
	user.permissions.host = true
	user.permissions.admin = true
	room.addMember(user.id)
	room.topicName = req.query.topicName as string
	room.counter.default = Number.parseInt(req.query.timer as string)
	room.counter.count = room.counter.default
	if (req.query.timerEnabled as string == "true" || req.query.timerEnabled as string == "True"){
		room.roomCounterEnabled = true
	} else {
		room.roomCounterEnabled = false
	}
	res.send({ room })
})

router.get("/getroombyid", (req, res) => {
	let id: string = req.query.id as string

	let room: HCRoom = HCRoom.get(Number.parseInt(id))
	res.send(room)
})

router.get("/joinRoom", authenticateOrCreateToken, (req, res) => {
	let id: string = req.query.id as string
	let spectatorMode:string = req.query.spectatorMode as string

	let user: HCUser | undefined = req.user

	if (user == undefined) {
		user = new HCUser
		let jwtToken = generateAccessToken(user.id);
		res.cookie("token", jwtToken)
		res.cookie("_id", user.id)
	}

	let room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room == undefined) {
		res.redirect("/")
		return
	}
	user.reset()
	room.addMember(user.id)
	room.emitRoomStateUpdate()

	if (spectatorMode == "true") {
		user.userVotingStatus = HCVotingStatus.spectating
	}
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

router.get("/setTimerActive", authenticateToken, (req, res) => {

	let user: HCUser | undefined = req.user
	if (user == undefined || !user.permissions.host) {
		res.sendStatus(401)
		return
	}

	var id: string = req.query.id as string
	var count: string = req.query.count as string
	var enabled:string = req.query.enabled as string
	var room: HCRoom = HCRoom.get(Number.parseInt(id))
	if (room != undefined) {
		room.counter.default = Number.parseInt(count)
		room.counter.count = room.counter.default
		if (enabled == "true"){
			room.roomCounterEnabled = true
		} else {
			room.roomCounterEnabled = false
		}
		room.emitRoomStateUpdate()
	}
})

router.get("/allowAnonymous", authenticateToken, (req, res) => {
	let user: HCUser | undefined = req.user
	if (user == undefined || !user.permissions.host) {
		res.sendStatus(401)
		return
	}

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

	if (room == undefined) {
		res.send()
		return
	}
	
	var data: Array<Object> = new Array<Object> 
	function mapRevotes(map: TSMap<string, number>, index: number, topicName: string, url: string = "") {
		Object.keys(map).forEach((key: string) => {
			var voteObj = {
				topic: topicName,
				revoteNumber: index,
				name: HCUser.get(key as string).displayName,
				vote: Object.values(map)[Object.keys(map).findIndex(k => k==key)],
				url: url,
			}
			data.push(voteObj)
		})
	}
	
	if (topic != undefined) {
		let vote: HistoricalVote = room.history[Number.parseInt(topic)]
		vote.Revotes.forEach((value, index) => mapRevotes(value, index, vote.TopicName, vote.URL))
	} 
	else {
		room.history.forEach((vote: HistoricalVote) => {
			vote.Revotes.forEach((value, index) => mapRevotes(value, index, vote.TopicName, vote.URL))
		})
	}

	const csv = papa.unparse(data, {
		header: true
	});
	res.write(csv)

	res.send()
})
router.get("/delete", (req, res) => {
	let id = req.query.id as string
	let topic = req.query.topic as string
	let room = HCRoom.get(Number.parseInt(id))

	if (room == undefined) {
		res.send()
		return
	}

	if (topic != undefined) {
		room.history.splice(Number.parseInt(topic), 1)
	} 
	else {
		room.history = []
	}
	res.send()
})
router.get("/kickuser", authenticateToken, (req, res) => {
	let user: HCUser | undefined = req.user
	if (user == undefined || !user.permissions.host) {
		res.sendStatus(401)
		return
	}
	var id: string = req.query.id as string
	var userToBeKicked = HCUser.get(id)
	var room = HCRoom.get(userToBeKicked.currentRoom)

	if (userToBeKicked != undefined && room != undefined){
		room.kickuser(userToBeKicked)
	}

	res.send()
})
router.get("/promote", authenticateToken, (req, res) => {
	let user: HCUser | undefined = req.user
	if (user == undefined || !user.permissions.host) {
		res.sendStatus(401)
		return
	}
	var id: string = req.query.id as string
	var promote:string = req.query.promote as string
	var userToBePromoted = HCUser.get(id)
	var room = HCRoom.get(userToBePromoted.currentRoom)

	if (userToBePromoted != undefined && room != undefined){
		userToBePromoted.userVotingStatus = HCVotingStatus.voting
		if (promote == "true"){
			userToBePromoted.permissions.host = true
		} else {
			userToBePromoted.permissions.host = false
		}
		room.emitRoomStateUpdate()
	}

	res.send()
})


module.exports = router;