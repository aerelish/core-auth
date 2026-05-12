/**
 * @file src/routes/auth/index.ts
 * @description router for user authentication
 */

import express from 'express';
import { authMiddleware } from '@/middlewares/auth';
import { register, login } from './controller';

const auth = express.Router();

auth.post('/register', register);
auth.post('/login', login);

// for testing the auth middleware
auth.get('/me', authMiddleware, (req, res) => {
	res.json({ user: req.user });
});

export default auth;
