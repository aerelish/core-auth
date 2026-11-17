-- Migration: 20260325201728_migrations_create-core-tables

/* 
  This migration creates the core tables for user authentication and token management. 
  The "users" table stores user information, including email and password hash, while the "refresh_tokens" table manages refresh tokens for authentication sessions.
*/


/* 
  The "users" table is designed to store user information for authentication purposes. 
  It includes an auto-incrementing primary key "id", a unique "email" field, a "password_hash" for securely storing user passwords, 
  and timestamps for when each record was created and last updated.
*/
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* 
  The "refresh_tokens" table is designed to store refresh tokens for user authentication. 
  Each token is associated with a user and includes a hash of the token, a family ID for grouping related tokens, 
  a flag to indicate if the token has been revoked, and an expiration timestamp. 
  The table also includes timestamps for when each record was created and last updated.
*/
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(512) NOT NULL,
  family_id VARCHAR(255) NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);