import { NextFunction, Request } from 'express';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { verifyAccessToken } from '@/lib/token';

export const authMiddleware = (req: Request, next: NextFunction) => {
	const accessToken = req.cookies.accessToken;
	if (!accessToken) {
		throw new UnauthorizedError();
	}
	try {
		const decoded = verifyAccessToken(accessToken);
		req.user = { id: decoded };
		next();
	} catch (error) {
		throw new UnauthorizedError();
	}
};
