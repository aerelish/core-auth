/**
 * @file app.ts
 * @description express application setup with security and error handling middlewares
 * @author Ejohn
 */

import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from '@/middlewares/error-handler';

const app = express();

app.use(helmet());
app.use(express.json());

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
