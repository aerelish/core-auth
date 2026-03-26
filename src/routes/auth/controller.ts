/**
 * @description controller for user authentication
 * @author Ejohn
 */

import { Request, Response } from 'express';
import { AppError } from '@/errors/AppError';
import * as authService from './service';

export async function register(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	try {
		await authService.registerUser(email, password);
		return res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export function login(req: Request, res: Response) {
	// TODO: implement user login controller
}
