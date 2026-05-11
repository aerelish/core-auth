/**
 * @description service layer for authentication logic, e.g. user registration, login, etc.
 * @author Ejohn
 */

import bcrypt from 'bcrypt';
import { AppError } from '@/errors/AppError';
import { db } from '@/db/connection';

const DUMMY_HASH = '$2b$12$KIXQJYVqGq8XyYpHn.5euJjGQ9e0iZ5a6u1vZ1z1z1z1z1z1z1z'; // hash for "dummy_password"
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

/**
 * register a new user with the given email and password
 * @param email string
 * @param password string : raw password, will be hashed before storing in database
 * @throws AppError if email is invalid, password is too short, or email is already in use
 */
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
	await db.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
}

/**
 * login a user with the given email and password, provides token if successful
 * @param email string
 * @param password string : raw password, will be compared with hashed password in database
 * @throws AppError if email does not exist or password is incorrect
 * @returns object containing user ID if login is successful
 */
export async function loginUser(email: string, password: string): Promise<{ id: number }> {
	// fetch user by email
	const [rows] = await db.execute('SELECT id, password_hash FROM users WHERE email = ?', [email]);

	// get row as user and compare the password with the hashed password in the database
	const user = (rows as any[])[0];

	// use dummy hash if user not found to prevent timing based user enumeration attacks
	const passwordToCheck = user ? user.password_hash : DUMMY_HASH;
	const isPasswordValid = await bcrypt.compare(password, passwordToCheck);

	if (!user || !isPasswordValid) {
		throw new AppError('Invalid credentials', 401);
	}

	return { id: user.id };
}
