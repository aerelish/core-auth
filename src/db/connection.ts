/**
 * @file db/connection.ts
 * @description MySQL connection pool using mysql2
 * @author Ejohn
 */

import mysql from 'mysql2/promise';
import { ENV } from '@/config/env';

// create a MySQL connection pool using mysql2
export const db = mysql.createPool({
	host: ENV.DB_HOST,
	database: ENV.DB_NAME,
	user: ENV.DB_USER,
	password: ENV.DB_PASSWORD,
	waitForConnections: true, // allow the pool to queue connection requests when all connections are in use
	connectionLimit: 10, // maximum number of connections in the pool
	queueLimit: 0, // unlimited number of queued connection requests (0 means no limit)
});
