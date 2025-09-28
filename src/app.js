const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const jobRoutes = require("./routes/jobRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create upload and output directories
async function createDirectories() {
  await fs.mkdir(process.env.UPLOAD_DIR || "./uploads", { recursive: true });
  await fs.mkdir(process.env.OUTPUT_DIR || "./outputs", { recursive: true });
}
createDirectories();

// Routes
app.use("/projects", projectRoutes);
app.use("/jobs", jobRoutes);
app.use("/analytics", analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
