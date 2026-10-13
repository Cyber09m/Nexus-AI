export function notFound(_req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';
  let code = err.code;

  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'That file is too large. Try a smaller one.';
    code = 'VALIDATION';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON.';
  } else if (status >= 500 && code !== 'NOT_CONFIGURED') {
    console.error(err);
    if (!err.status) message = 'Unexpected server error. Please try again.';
  }
  res.status(status).json({ success: false, message, code });
}
