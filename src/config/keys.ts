/**
 * @file Loads RSA keys for JWT signing from environment variables.
 * @description This module reads the JWT private and public keys from environment variables,
 * decodes them from base64, and exports them for use in the application.
 * The keys must be provided as base64-encoded PEM strings in the .env file.
 * @author Ejohn
 */

function loadKey(envVarName: string): string {
	const base64Value = process.env[envVarName];

	// throw immediately if the environment variable is missing, to fail fast and clearly at startup.
	if (!base64Value) {
		throw new Error(`Missing required environment variable: ${envVarName}. ` + `Generate keys with openssl and add them to your .env file.`);
	}

	// decode the base64 value to get the original PEM string using Buffer, which is a built-in Node.js class for handling binary data.
	const pem = Buffer.from(base64Value, 'base64').toString('utf-8');

	// sanity check: the decoded string should start with "-----BEGIN" if it's a valid PEM key. If not, throw an error to alert the developer that the key was not properly encoded or is not a valid PEM format.
	if (!pem.startsWith('-----BEGIN')) {
		throw new Error(
			`Environment variable ${envVarName} does not appear to be a valid ` +
				`base64-encoded PEM key. Re-encode your .pem file with: base64 -i key.pem`,
		);
	}

	return pem;
}

// Load both keys at module import time — this means the error is thrown
// the moment the app starts, not lazily when the first token is signed.
// This is intentional: startup failure is far easier to diagnose than
// a runtime failure that only appears when a user tries to log in.
export const privateKey = loadKey('JWT_PRIVATE_KEY');
export const publicKey = loadKey('JWT_PUBLIC_KEY');
