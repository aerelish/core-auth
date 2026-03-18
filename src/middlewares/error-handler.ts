import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/AppError';
import { NotFoundError } from '@/errors/NotFoundError';

const isDev = process.env.NODE_ENV === 'development';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	// if headers already sent, delegate to Express
	if (res.headersSent) return next(err);

	// operational error — known, safe to expose message
	if (err instanceof AppError && err.isOperational) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
			...(isDev && { stack: err.stack }),
		});
	}

	// programmer error — don't leak details in production
	console.error('UNHANDLED ERROR:', err);

	return res.status(500).json({
		status: 'error',
		message: isDev ? err.message : 'Something went wrong',
		...(isDev && { stack: err.stack }),
	});
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
};
