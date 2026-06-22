const logger = {
  info: (msg) => console.log("[INFO]", msg),
  error: (msg) => console.error("[ERROR]", msg),
};

export { logger };

export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error({ status, message, path: req.path, method: req.method });

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
