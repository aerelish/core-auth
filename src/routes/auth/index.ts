/**
 * @file src/routes/auth/index.ts
 * @description router for user authentication
 */

import express from 'express';
import { register, login } from './controller';

const auth = express.Router();

auth.post('/register', register);
auth.post('/login', login);

export default auth;
