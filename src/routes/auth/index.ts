/**
 * @file src/routes/auth/index.ts
 * @description router for user authentication
 */

import express from 'express';
import { authMiddleware } from '@/middlewares/auth';
import { authLoginLimiter, authRegisterLimiter, authRefreshLimiter } from '@/middlewares/rate-limits';
import { register, login, refresh, logout } from './controller';

const auth = express.Router();

auth.post('/register', authRegisterLimiter, register);
auth.post('/login', authLoginLimiter, login);
auth.post('/logout', logout);
auth.post('/refresh', authRefreshLimiter, refresh);

// for testing the auth middleware
auth.get('/me', authMiddleware, (req, res) => {
	res.json({ user: req.user });
});

export default auth;
