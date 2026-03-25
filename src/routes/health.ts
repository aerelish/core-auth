/**
 * @file health.ts
 * @description health check route for monitoring
 * @author Ejohn
 */

import express from 'express';

const health = express.Router();

health.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

export default health;
