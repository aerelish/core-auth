import express from 'express';
import { AppError } from '@/errors/AppError';
import { UnauthorizedError } from '@/errors/UnauthorizedError';

const router = express.Router();

router.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// throw a known operational error
router.get('/test/unauthorized', (req, res, next) => {
	next(new UnauthorizedError());
});

// throw a non-operational error
router.get('/test/crash', (req, res, next) => {
	next(new AppError('DB pool exhausted', 500, false));
});

// throw an unexpected programmer error
router.get('/test/unhandled', (req, res, next) => {
	next(new Error('Something totally unexpected'));
});

export default router;
