const { pool } = require("../config/database");

class Asset {
  static async create(projectId, fileData) {
    const query = `
      INSERT INTO assets (project_id, filename, original_name, mimetype, size, path)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      projectId,
      fileData.filename,
      fileData.originalname,
      fileData.mimetype,
      fileData.size,
      fileData.path,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByProjectId(projectId) {
    const query =
      "SELECT * FROM assets WHERE project_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  static async findById(id) {
    const query = "SELECT * FROM assets WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = "DELETE FROM assets WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Asset;
