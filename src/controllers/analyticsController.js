const Analytics = require("../models/Analytics");
const Project = require("../models/Project");

class AnalyticsController {
  async logEvent(req, res, next) {
    try {
      const { projectId, eventType, metadata } = req.body;

      if (!projectId || !eventType) {
        return res.status(400).json({
          error: "projectId and eventType are required",
        });
      }

      // Validate event type
      const validEventTypes = [
        "play",
        "click",
        "impression",
        "view",
        "complete",
      ];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({
          error: `Invalid event type. Must be one of: ${validEventTypes.join(
            ", "
          )}`,
        });
      }

      // Check if project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const event = await Analytics.log(projectId, eventType, metadata);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  async getProjectAnalytics(req, res, next) {
    try {
      const { projectId } = req.params;
      const { eventType } = req.query;

      const events = await Analytics.findByProjectId(projectId, eventType);
      const eventCounts = await Analytics.getEventCounts(projectId);

      res.json({
        events,
        summary: eventCounts,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
