export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error('[Global Error]', JSON.stringify(err, null, 2));

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'Image 10MB se choti honi chahiye';
    statusCode = 400;
  }

  // Cloudinary ka error handle
  if (err.http_code) {
    message = `Cloudinary Error: ${err.message}`;
    statusCode = err.http_code;
  }

  res.status(statusCode).json({
    success: false,
    message: message
  });
};