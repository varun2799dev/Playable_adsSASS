const Job = require("../models/Job");
const Project = require("../models/Project");
const { processRenderJob } = require("../queues/renderQueue");

class JobController {
  async createRenderJob(req, res, next) {
    try {
      const { id: projectId } = req.params;

      // Check if project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Create job in DB
      const job = await Job.create(projectId, "render", req.body);

      // Start processing directly (async, without Redis)
      processRenderJob(job.id, projectId, req.body);

      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  }

  async getJobStatus(req, res, next) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }

  async getProjectJobs(req, res, next) {
    try {
      const { id: projectId } = req.params;
      const jobs = await Job.findByProjectId(projectId);
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobController();
