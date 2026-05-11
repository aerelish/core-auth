/**
 * @description controller for user authentication
 * @author Ejohn
 */

import { Request, Response } from 'express';
import { AppError } from '@/errors/AppError';
import { ENV } from '@/config/env';
import { logger, parseDurationInMs } from '@/lib/utils';
import { issueTokenPair } from './service.token';
import * as authService from './service';

/**
 * validate the presence and type of email and password fields in the request body, and return them as strings
 * @param email unknown : email from req.body
 * @param password unknown : password from req.body
 * @returns validated and casted email and password, email is also trimmed of whitespace
 * @throws AppError if email or password is missing or not a string
 */
function checkRequiredFields(email: unknown, password: unknown) {
	const emailStr = typeof email === 'string' ? email.trim() : '';
	const passwordStr = typeof password === 'string' ? password : '';

	if (!emailStr || !passwordStr) {
		throw new AppError('Email and password are required', 400);
	}

	return { email: emailStr, password: passwordStr };
}

/**
 * handle errors and send appropriate response
 * @param error unknown : the error object
 * @param res Response : the express response object
 * @returns Response : the express response object with error message
 */
function handleError(error: unknown, res: Response) {
	if (error instanceof AppError) {
		return res.status(error.statusCode).json({ message: error.message });
	}
	logger.error(error, 'Unhandled error');
	return res.status(500).json({ message: 'Internal server error' });
}

/**
 * calls the registerUser service to register a new user with email and password
 * @param req Request : the express request object
 * @param res Response : the express response object
 * @returns Response : the express response object with message if successful, or error message if not
 */
export async function register(req: Request, res: Response) {
	try {
		// TODO: validate the request body using zod
		const { email, password } = req.body;
		const { email: validEmail, password: validPassword } = checkRequiredFields(email, password);

		await authService.registerUser(validEmail, validPassword);

		return res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		return handleError(error, res);
	}
}

/**
 * calls the loginUser service to login a user with email and password
 * @param req Request : the express request object
 * @param res Response : the express response object
 * @returns Response : the express response object with message if successful, or error message if not
 */
export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		const { email: validEmail, password: validPassword } = checkRequiredFields(email, password);

		const { id } = await authService.loginUser(validEmail, validPassword);
		const { accessToken, refreshToken } = await issueTokenPair(id);

		/** set cookies for access and refresh tokens */

		// set secure flag only if in production to prevent man in the middle attacks
		// in other words: accessToken and refreshToken is sent only via https in production
		const isProd = ENV.NODE_ENV === 'production';

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: isProd, // HTTPS only on production
			sameSite: 'strict', // prevent CSRF attack ( cross site request forgery )
			path: '/api/v1/', // make sure the cookie is sent for all routes under /api/v1/, adjust as needed
			maxAge: parseDurationInMs(ENV.JWT_ACCESS_EXPIRES_IN),
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: isProd, // HTTPS only on production
			sameSite: 'strict', // prevent CSRF attack ( cross site request forgery )
			path: '/api/v1/auth/refresh', // only send refresh token for the refresh endpoint
			maxAge: parseDurationInMs(ENV.JWT_REFRESH_EXPIRES_IN),
		});

		return res.status(200).json({ message: 'Logged in successfully' });
	} catch (error) {
		return handleError(error, res);
	}
}
