const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const assetController = require("../controllers/assetController");
const jobController = require("../controllers/jobController");
const upload = require("../middleware/upload");

// Project endpoints
router.post("/", projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

// Asset endpoints
router.post("/:id/assets", upload.single("file"), assetController.uploadAsset);
router.get("/:id/assets", assetController.getProjectAssets);
router.delete("/:id/assets/:assetId", assetController.deleteAsset);

// Render job endpoint
router.post("/:id/render", jobController.createRenderJob);
router.get("/:id/jobs", jobController.getProjectJobs);

module.exports = router;
