import crypto from 'crypto';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { privateKey, publicKey, ENV } from '@/config';
import { db } from '@/db/connection';
import { parseDurationInMs } from '@/lib/utils';

const JWT_EXPIRES_IN = ENV.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'];

/**
 * hash the given token using SHA-256, this is used to store refresh tokens securely in the database
 * @param token string : opaque token using crypto
 * @returns string : hashed token using SHA-256
 */
export function hashToken(token: string): string {
	// hash the token using SHA-256 and return the hex string
	// this is same logic with passwords so it won't be compromised in case of breach
	return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * generate a random opaque token for refresh token
 * @returns string : a randomly generated opaque token
 */
export function generateRefreshToken(): string {
	// generate a random opaque token using crypto and return it as hex string, "opaque" means the token has no inherent meaning or structure
	// intentionally not using JWT here, as JWTs are self-verifying : means stolen refresh token could be used without database check
	// this forces db lookup for refresh tokens, allowing token revocation and better security
	return crypto.randomBytes(64).toString('hex');
}

/**
 * issue a new access token and refresh token pair for the given user ID, and store the hashed refresh token in the database
 * @param userId number : the user ID for which the token pair is being issued
 * @returns object containing the access token and refresh token
 */
export async function issueTokenPair(userId: number): Promise<{ accessToken: string; refreshToken: string }> {
	// access token ---
	// signed with the private key using RS256.
	// payload is kept intentionally minimal — just the user ID and standard JWT claims (iat = issued at, exp = expiry, both auto-set).
	// token travels in a cookie on every request, and every byte in it is a potential information leak if intercepted. never put sensitive data
	const accessToken = jwt.sign({ userId }, privateKey, { algorithm: 'RS256', expiresIn: JWT_EXPIRES_IN });

	// refresh token ---
	// generating a refresh token and hashing it before storing in the database
	const refreshToken = generateRefreshToken();
	const hashedRefreshToken = hashToken(refreshToken);

	// calculate expiry date for refresh token
	const expiresAt = new Date(Date.now() + parseDurationInMs(ENV.JWT_REFRESH_EXPIRES_IN));

	// note: family_id is used to link refresh tokens issued together, so if one is compromised, we can revoke the entire family of tokens
	// this is useful for security, as refresh tokens are long-lived and more vulnerable to theft
	// if a refresh token is stolen, we can revoke all tokens in the same family, preventing further unauthorized access
	await db.execute(
		`INSERT INTO refresh_tokens (user_id, token_hash, family_id, expires_at)
     VALUES (?, ?, UUID(), ?)`,
		[userId, hashedRefreshToken, expiresAt],
	);

	return { accessToken, refreshToken };
}

/**
 * verifies the given access token using the public key and returns the decoded payload if valid
 * @param token string : the access token to verify
 * @returns JwtPayload : the decoded payload of the access token
 */
export function verifyAccessToken(token: string): JwtPayload {
	// jwt.verify will throw an error if the token is invalid or expired, so we can just let it propagate and handle it in the controller
	// note: explicitly white-listing RS56 to prevent algorithm confusion attacks, where an attacker could trick the system into accepting a token signed with a weaker algorithm
	return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
}
