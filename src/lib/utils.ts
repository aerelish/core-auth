/**
 * @file utils.ts
 * @description utility functions for the application
 * @author Ejohn
 */

import pino from 'pino';

/**
 * logger instance for the application
 * @description: pino is a logger library for Node.js, it is used to log messages to the console
 * @author Ejohn
 */
export const logger = pino({
	level: 'info',
	transport: {
		target: 'pino-pretty', // pretty logs in dev
		options: {
			colorize: true, // add colors to the logs
		},
	},
});

/**
 * parse a duration string (e.g. "15m", "7d", "1h") into milliseconds
 * @param duration string : e.g. "15m", "7d", "1h", etc.
 * @returns number : duration in milliseconds
 */
export function parseDurationInMs(duration: string): number {
	const match = duration.match(/^(\d+)([dhms])$/);
	if (!match) throw new Error('Invalid duration format');

	const [, value, unit] = match;
	const num = parseInt(value, 10);

	const multipliers: Record<string, number> = {
		d: 24 * 60 * 60 * 1000,
		h: 60 * 60 * 1000,
		m: 60 * 1000,
		s: 1000,
	};

	return num * multipliers[unit];
}
