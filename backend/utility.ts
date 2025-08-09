import { v4 as uuidv4 } from "uuid"
import HCRoom from "./models/HCRoom"
import * as fs from 'fs';
import * as path from 'path';

export function generateRoomId() {
	let newRoomId: number = Math.floor(Math.random() * 100000000)
	if (newRoomId < 10000000) {
		newRoomId *= 10
	}

	if (HCRoom.exists(newRoomId)) {
		return generateRoomId()
	}

	return newRoomId
}
export function generateUserId() {
	return uuidv4()
}
export function delayMs(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
export function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomAvatar() {
	let scale: number = 100//getRandomNumber(50,150)
	let radius: number = getRandomNumber(0, 50)
	let tranx: number = getRandomNumber(-15, 15)
	let trany: number = getRandomNumber(-15, 15)
	let rotate: number = getRandomNumber(-45, 45)
	if (rotate < 0) {
		rotate = 360 + rotate
	}

	let url: string = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${uuidv4()}&size=32&scale=${scale}&radius=${radius}&translateX=${tranx}&translateY=${trany}&rotate=${rotate}`
	return url
}

export function deleteAllFilesWithName(filename: string, directory: string) {
	fs.readdir(directory, (err, files) => {

		files.forEach((file: any) => {
			if (path.parse(file).name === filename) {
				const filePath = path.join(directory, file);
				fs.unlink(filePath, (err: any) => { });
			}
		});
	});
}