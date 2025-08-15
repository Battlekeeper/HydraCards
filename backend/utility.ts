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

export function clamp(num: number, min: number, max: number) {
	return Math.min(Math.max(num, min), max);
}

const AVATAR_COLORS = [
	"00acc1",
	"1e88e5",
	"5e35b1",
	"6d4c41",
	"7cb342",
	"8e24aa",
	"039be5",
	"43a047",
	"546e7a",
	"00897b",
	"3949ab",
	"757575",
	"c0ca33",
	"d81b60",
	"e53935",
	"f4511e",
	"fb8c00",
	"fdd835",
	"ffb300",
]

export function randomAvatar(seed: string = uuidv4(), scale: number = getRandomNumber(50, 150), radius: number = getRandomNumber(0, 50), translateX: number = getRandomNumber(-15, 15), translateY: number = getRandomNumber(-15, 15), rotate: number = getRandomNumber(-45, 45), backgroundRotation: number = getRandomNumber(0, 360), backgroundColor: string = 'ffffff'): string {
	scale = clamp(scale, 50, 150)
	radius = clamp(radius, 0, 50)
	translateX = clamp(translateX, -15, 15)
	translateY = clamp(translateY, -15, 15)
	if (rotate < 0) {
		rotate = 360 + rotate
	}
	if (backgroundColor == 'ffffff') {
		backgroundColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
	}
	let url: string = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&size=32&scale=${scale}&radius=${radius}&translateX=${translateX}&translateY=${translateY}&rotate=${rotate}&backgroundRotation=${backgroundRotation}&backgroundColor=${backgroundColor}`
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