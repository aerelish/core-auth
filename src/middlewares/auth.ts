import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { verifyAccessToken } from '@/services/token';

/**
 * middleware to authenticate the user by verifying the access token via verifyAccessToken function
 * @param req Request : the express request object
 * @param res Response : the express response object | not used in this middleware but required by the express middleware signature
 * @param next NextFunction : the next function to call
 * @throws UnauthorizedError if the access token is not present or invalid
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// get the access token from the cookies : needs cookie-parser middleware to be used
	const accessToken = req.cookies.accessToken;
	if (!accessToken) {
		throw new UnauthorizedError();
	}
	try {
		// verify the access token and set the user in the request object
		const decoded = verifyAccessToken(accessToken);
		// NOTE: req.user { id: { userId, iat, exp }} - this is the JWT payload shape
		req.user = { id: decoded };
		next();
	} catch (error) {
		throw new UnauthorizedError();
	}
};
