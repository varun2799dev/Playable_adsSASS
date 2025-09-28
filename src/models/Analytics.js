const { pool } = require("../config/database");

class Analytics {
  static async log(projectId, eventType, metadata = {}) {
    const query = `
      INSERT INTO analytics (project_id, event_type, metadata)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [projectId, eventType, JSON.stringify(metadata)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByProjectId(projectId, eventType = null) {
    let query = "SELECT * FROM analytics WHERE project_id = $1";
    const values = [projectId];

    if (eventType) {
      query += " AND event_type = $2";
      values.push(eventType);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getEventCounts(projectId) {
    const query = `
      SELECT event_type, COUNT(*) as count
      FROM analytics
      WHERE project_id = $1
      GROUP BY event_type
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }
}

module.exports = Analytics;
