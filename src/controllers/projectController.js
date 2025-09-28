const Project = require("../models/Project");

class ProjectController {
  async createProject(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const project = await Project.create(title, description);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async getProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async getAllProjects(req, res, next) {
    try {
      const projects = await Project.findAll();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const project = await Project.update(id, title, description);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      await Project.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Export an instance of the class
module.exports = new ProjectController();
