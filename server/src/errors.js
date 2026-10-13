export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const missingKey = (name, feature) =>
  new HttpError(503, `${feature} isn't configured on the server yet. Set ${name} in the server environment and restart.`, 'NOT_CONFIGURED');
