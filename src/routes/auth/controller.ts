/**
 * @description controller for user authentication
 * @author Ejohn
 */

import { Request, Response } from 'express';
import { AppError } from '@/errors/AppError';
import * as authService from './service';

function checkRequiredFields(email: string, password: string) {
	if (!email || !password) {
		throw new AppError('Email and password are required', 400);
	}
}

function handleError(error: unknown, res: Response) {
	if (error instanceof AppError) {
		return res.status(error.statusCode).json({ message: error.message });
	}
	return res.status(500).json({ message: 'Internal server error' });
}

export async function register(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		checkRequiredFields(email, password);

		await authService.registerUser(email, password);

		return res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		return handleError(error, res);
	}
}

export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		checkRequiredFields(email, password);

		await authService.loginUser(email, password);

		return res.status(200).json({ message: 'User logged in successfully' });
	} catch (error) {
		return handleError(error, res);
	}
}
