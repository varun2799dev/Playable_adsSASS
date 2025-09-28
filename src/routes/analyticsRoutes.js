const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.post("/", analyticsController.logEvent);
router.get("/projects/:projectId", analyticsController.getProjectAnalytics);

module.exports = router;
