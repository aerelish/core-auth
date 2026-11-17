import rateLimit from 'express-rate-limit';
import { TooManyRequestError } from '@/errors/TooManyRequestError';

const authRegisterLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // every 15 minutes
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	handler: () => {
		throw new TooManyRequestError();
	},
});

export default authRegisterLimiter;
