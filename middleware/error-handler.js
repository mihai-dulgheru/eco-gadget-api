function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'A apărut o eroare internă a serverului.';
  res.status(statusCode).json({ name: 'ServerError', message });
}

export default errorHandler;
