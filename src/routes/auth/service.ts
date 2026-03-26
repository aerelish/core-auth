/**
 * @description service layer for authentication logic, e.g. user registration, login, etc.
 * @author Ejohn
 */

import bcrypt from 'bcrypt';
import { AppError } from '@/errors/AppError';
import { db } from '@/db/connection';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

export async function registerUser(email: string, password: string) {
	if (!EMAIL_REGEX.test(email)) {
		throw new AppError('Invalid email format', 400);
	}

	if (password.length < 8) {
		throw new AppError('Password must be at least 8 characters long', 400);
	}

	// just checking if it returns any row, means email is already in use
	const [rows] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
	if ((rows as any[]).length > 0) {
		throw new AppError('Email already in use', 409);
	}

	// hash the password before storing it in the database
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	// store the new user in the database
	await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
}

export function loginUser(email: string, password: string) {
	// TODO: implement user login logic, e.g. verify credentials, generate JWT token, etc.
}
