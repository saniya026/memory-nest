import { isMongoConnectionError } from '../config/db.js';

export const errorHandler = (err, req, res, next) => {
  if (isMongoConnectionError(err)) {
    return res.status(503).json({
      success: false,
      message:
        'Database is unavailable. Start MongoDB or set MONGODB_URI in backend/.env (see MONGODB_SETUP.md).',
      code: 'DB_CONNECTION_FAILED',
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
