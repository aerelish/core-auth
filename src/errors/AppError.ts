/**
 * @file AppError.ts
 * @description custom error class for handling application-specific errors
 * @author Ejohn
 */

/**
 * @description AppError is a custom error class that extends the built-in Error class
 */
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	/**
	 * @param message the error message
	 * @param statusCode the HTTP status code
	 * @param isOperational indicates if the error is operational (default: true)
	 */
	constructor(message: string, statusCode: number, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		// Restore prototype chain (required in TypeScript when extending Error)
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}
