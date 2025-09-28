const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Job {
  static async create(projectId, type = "render", inputData = {}) {
    const id = uuidv4();
    const query = `
      INSERT INTO jobs (id, project_id, type, status, input_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [id, projectId, type, "pending", JSON.stringify(inputData)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = "SELECT * FROM jobs WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(
    id,
    status,
    outputPath = null,
    errorMessage = null
  ) {
    let query;
    let values;

    if (status === "processing") {
      query = `
        UPDATE jobs 
        SET status = $1, started_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      values = [status, id];
    } else if (status === "done") {
      query = `
        UPDATE jobs 
        SET status = $1, output_path = $2, completed_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `;
      values = [status, outputPath, id];
    } else if (status === "failed") {
      query = `
        UPDATE jobs 
        SET status = $1, error_message = $2, completed_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `;
      values = [status, errorMessage, id];
    } else {
      query = `
        UPDATE jobs 
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;
      values = [status, id];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByProjectId(projectId) {
    const query =
      "SELECT * FROM jobs WHERE project_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }
}

module.exports = Job;
