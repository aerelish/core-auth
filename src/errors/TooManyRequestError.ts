import { AppError } from './AppError';

export class TooManyRequestError extends AppError {
	constructor(message = 'Too Many Requests') {
		super(message, 429);
	}
}
