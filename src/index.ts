import express from 'express'
import helmet from 'helmet'
import { AppError, UnauthorizedError } from '@/errors/errors';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet());
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// throw a known operational error
app.get('/test/unauthorized', (req, res, next) => {
  next(new UnauthorizedError());
});

// throw a non-operational error
app.get('/test/crash', (req, res, next) => {
  next(new AppError('DB pool exhausted', 500, false));
});

// throw an unexpected programmer error
app.get('/test/unhandled', (req, res, next) => {
  next(new Error('Something totally unexpected'));
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})