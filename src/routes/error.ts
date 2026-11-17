/**
 * @file exports error routes
 * @description mainly for testing error handling middlewares with different types of errors
 * @author Ejohn
 */

import express from 'express';
import { AppError } from '@/errors/AppError';
import { UnauthorizedError } from '@/errors/UnauthorizedError';

const error = express.Router();

// throw a known operational error
error.get('/unauthorized', (req, res, next) => {
	next(new UnauthorizedError());
});

// throw a non-operational error
error.get('/crash', (req, res, next) => {
	next(new AppError('DB pool exhausted', 500, false));
});

// throw an unexpected programmer error
error.get('/unhandled', (req, res, next) => {
	next(new Error('Something totally unexpected'));
});

export default error;
