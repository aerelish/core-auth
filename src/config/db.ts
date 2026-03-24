/**
 * @file config/db.ts
 * @description MySQL connection pool using mysql2
 * @author Ejohn
 */

import mysql from 'mysql2/promise';
import { ENV } from '@/config/env';

export const pool = mysql.createPool({
	host: ENV.DB_HOST,
	database: ENV.DB_NAME,
	user: ENV.DB_USER,
	password: ENV.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});
