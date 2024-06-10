function errorHandler(err, _req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({ name: 'ServerError', message });
}

export default errorHandler;
