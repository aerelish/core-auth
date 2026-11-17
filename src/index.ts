/**
 * @file index.ts
 * @description entry point of the application. It starts the server and listens on the specified port.
 * @author Ejohn
 */

import app from './app';
import { ENV } from './config';
import { runMigrations } from './db/migrate';

const { PORT } = ENV;
const REFRESH_TOKEN_CLEANUP_INTERVAL = 1000 * 60 * 60 * 24; // 24 hours

async function runRefreshTokenCleanup() {
	try {
		//TODO: implement refresh token cleanup logic
	} catch (error) {
		console.error('Error running refresh token cleanup:', error);
	}
}

async function startServer() {
	try {
		// run database migrations before starting the server
		console.log('running database migrations...');
		await runMigrations();
		console.log('database migrations completed successfully');

		// once migrations are done, start the server
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

		// start the refresh token cleanup interval
		runRefreshTokenCleanup();
		setInterval(runRefreshTokenCleanup, REFRESH_TOKEN_CLEANUP_INTERVAL);
	} catch (error) {
		console.error('Error running database migrations:', error);
		process.exit(1);
	}
}

startServer();
