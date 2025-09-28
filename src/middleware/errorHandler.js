// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Multer errors (file upload)
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
    return res.status(400).json({ error: err.message });
  }

  // Handle file type errors
  if (err.message && err.message.includes("Only image and video files")) {
    return res.status(400).json({ error: err.message });
  }

  // Handle PostgreSQL errors
  if (err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({ error: "Resource already exists" });
  }

  if (err.code === "23503") {
    // Foreign key constraint violation
    return res
      .status(400)
      .json({ error: "Invalid reference to related resource" });
  }

  if (err.code === "23502") {
    // Not null constraint violation
    return res.status(400).json({ error: "Required field is missing" });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
