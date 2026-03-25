/**
 * @file index.ts
 * @description entry point of the application. It starts the server and listens on the specified port.
 * @author Ejohn
 */

import app from './app';
import { ENV } from './config';
import { runMigrations } from './db/migrate';

const { PORT } = ENV;

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
	} catch (error) {
		console.error('Error running database migrations:', error);
		process.exit(1);
	}
}

startServer();
