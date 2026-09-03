export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ ok: false, error: { code: 'FILE_TOO_LARGE', message: 'Max 8MB' } });
  }
  if (err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ ok: false, error: { code: 'INVALID_FILE_TYPE', message: 'Invalid file type' } });
  }
  if (err.code === 'INVALID_INPUT') {
    return res.status(400).json({ ok: false, error: { code: 'INVALID_INPUT', message: err.message } });
  }
  if (err.code === 'MODEL_FAILURE') {
    return res.status(422).json({ ok: false, error: { code: 'MODEL_FAILURE', message: err.message } });
  }
  
  res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: err.message || 'Internal Server Error' } });
}
