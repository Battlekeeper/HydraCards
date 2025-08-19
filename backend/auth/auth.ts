import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HCUser from '../models/HCUser';
require("dotenv").config();

declare global {
  namespace Express {
	interface Request {
	  user?: HCUser;
	}
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET || JWT_SECRET.length === 0) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authCookie = req.cookies['token'];

	jwt.verify(authCookie, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
		if (err) {
			res.clearCookie("token")
			res.clearCookie("_id")
			res.redirect("/")
			return
		}
		req.user = HCUser.get((decoded as JwtPayload).sub as string);
		next();
	});
}
export function authenticateOrCreateToken(req: Request, res: Response, next: NextFunction) {
	const authCookie = req.cookies['token'];

	jwt.verify(authCookie, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
		if (err) {
			next();
			return
		}
		req.user = HCUser.get((decoded as JwtPayload).sub as string);
		next();
	});
}

export function generateAccessToken(userId: string) {
	return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function validateToken(token: string, userId?: string) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		if (userId && decoded.sub !== userId) {
			return false;
		}
		return true;
	} catch (err) {
		return false;
	}
}