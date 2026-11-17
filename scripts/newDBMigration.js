const fs = require('fs');
const path = require('path');

const createNewMigration = () => {
	const name = process.argv[2];

	if (!name) {
		console.error('Error: migration name is required');
		console.error('Usage: npm run migrate:new -- <name>');
		process.exit(1);
	}

	const now = new Date();
	const timestamp =
		now.getFullYear().toString() +
		String(now.getMonth() + 1).padStart(2, '0') +
		String(now.getDate()).padStart(2, '0') +
		String(now.getHours()).padStart(2, '0') +
		String(now.getMinutes()).padStart(2, '0') +
		String(now.getSeconds()).padStart(2, '0');

	const migrationName = `${timestamp}_migrations_${name}`;
	const migrationDir = path.join(__dirname, '../src/db/migrations');

	if (!fs.existsSync(migrationDir)) {
		fs.mkdirSync(migrationDir, { recursive: true });
	}

	const migrationContent = `-- Migration: ${migrationName}\n-- TODO: add your SQL here\n`;
	const filePath = path.join(migrationDir, `${migrationName}.sql`);
	fs.writeFileSync(filePath, migrationContent);

	console.log(`Migration created: ${filePath}`);
};

createNewMigration();
