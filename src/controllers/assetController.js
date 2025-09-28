const Asset = require("../models/Asset");
const Project = require("../models/Project");
const fs = require("fs").promises;
const path = require("path");

class AssetController {
  async uploadAsset(req, res, next) {
    try {
      const { id: projectId } = req.params;

      // Check if project exists
      const project = await Project.findById(projectId);
      if (!project) {
        // Clean up uploaded file
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        return res.status(404).json({ error: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const asset = await Asset.create(projectId, req.file);
      res.status(201).json(asset);
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      next(error);
    }
  }

  async getProjectAssets(req, res, next) {
    try {
      const { id: projectId } = req.params;
      const assets = await Asset.findByProjectId(projectId);
      res.json(assets);
    } catch (error) {
      next(error);
    }
  }

  async deleteAsset(req, res, next) {
    try {
      const { assetId } = req.params;
      const asset = await Asset.delete(assetId);

      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      // Delete file from filesystem
      await fs.unlink(asset.path).catch(console.error);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssetController();
