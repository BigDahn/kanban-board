const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const userRouter = require('./routes/userRouter');
const boardRouter = require('./routes/boardRouter');
const notificationRouter = require('./routes/notificationRouter');

const globalErrorHandler = require('./controller/errorController');
const ErrorClass = require('./utils/ErrorClass');

const app = express();

app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimiter({
  max: 500,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later.',
});

app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: connection.status === 'ready' ? 'connected' : 'disconnected',
  };

  const isHealthy =
    health.mongo === 'connected' && health.redis === 'connected';

  res.status(isHealthy ? 200 : 503).json(health);
});

app.use('/api', limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/boards', boardRouter);
app.use('/api/v1/notifications', notificationRouter);

app.use((req, res, next) => {
  next(
    new ErrorClass(
      `Can't find route ${req.originalUrl} on this server!!!`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

module.exports = app;
