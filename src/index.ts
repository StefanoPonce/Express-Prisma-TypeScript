import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authorRouter from './routes/author.router';
import bookRouter from './routes/book.router';
import authRouter from './routes/auth.router';
import profileRouter from './routes/profile.router';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/requestLogger';
import { pino } from "pino";

dotenv.config();

// --- DIAGNÓSTICO TEMPORAL ---
console.log('CWD:', process.cwd());
console.log('PORT desde .env:', process.env.PORT);
// -----------------------------

export const logger = pino({ name: "server start" });

// Fallback: si PORT no carga bien, usa 3000 en vez de tronar con NaN
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();

// CORS Middleware
const corsOptions = {
  origin: process.env.APP_ENV == 'developement' ? '*' : process.env.ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// JSON Middleware & Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// Request Logger
app.use(requestLogger)

// Main Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/authors', authorRouter);
app.use('/api/books', bookRouter);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});