import express from 'express'
import helmet from 'helmet'
import testRoutes from '@/routes/tests'
import { errorHandler, notFoundHandler } from '@/middlewares/error-handler';

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet());
app.use(express.json())

app.use(testRoutes)

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})