const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/:id", jobController.getJobStatus);

module.exports = router;
