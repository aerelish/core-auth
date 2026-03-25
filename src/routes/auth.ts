import express from 'express';
import { register, login } from '@/controller/auth.controller';

const auth = express.Router();

auth.post('/register', register);
auth.post('/login', login);

export default auth;
