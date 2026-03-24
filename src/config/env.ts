/**
 * @file config/env.ts
 * @description environment variable management for the application
 * @author Ejohn
 */

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const DB_HOST = NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost';

export const ENV = {
	NODE_ENV: NODE_ENV,
	PORT: process.env.PORT ?? 3000,
	DB_HOST: DB_HOST,
	DB_NAME: process.env.DB_NAME ?? '',
	DB_USER: process.env.DB_USER ?? '',
	DB_PASSWORD: process.env.DB_PASSWORD ?? '',
};
