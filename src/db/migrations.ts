/**
 * @file db/migrations.ts
 * @description database migration runner for executing SQL migration files
 * @author Ejohn
 */

import fs from 'fs/promises';
import path from 'path';
import { db } from './connection';

export async function runMigrations() {
	// create a migration tracking table if it doesn't exist
	await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// check db which migration files have already been executed
	const [executedMigrations] = await db.query('SELECT filename FROM migrations');
	const executedFilenames = new Set((executedMigrations as any[]).map((m) => m.filename));

	// read and sort migration files from the migrations directory
	const migrationsDir = path.join(__dirname, 'migrations');
	const files = await fs.readdir(migrationsDir);
	const migrationFiles = files.filter((f) => f.endsWith('.sql')).sort();

	// execute each migration file that hasn't been executed yet
	for (const file of migrationFiles) {
		if (executedFilenames.has(file)) {
			console.log(`Skipping already executed migration: ${file}`);
			continue;
		}

		// read the SQL file and execute its contents
		const filePath = path.join(migrationsDir, file);
		const sql = await fs.readFile(filePath, 'utf-8');
		await db.execute(sql);

		// record the executed migration in the migrations table
		await db.execute('INSERT INTO migrations (filename) VALUES (?)', [file]);
		console.log(`Migration successfully executed: ${file}`);
	}
}
