/**
 * @file index.ts
 * @description main router that aggregates all route modules
 * @author Ejohn
 */

import express from 'express';
import errorRouter from './error';
import healthRouter from './health';

const router = express.Router();

router.use('/error', errorRouter);
router.use('/health', healthRouter);

export default router;
