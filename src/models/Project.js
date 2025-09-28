const { pool } = require("../config/database");

class Project {
  static async create(title, description) {
    const query = `
      INSERT INTO projects (title, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [title, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = "SELECT * FROM projects WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = "SELECT * FROM projects ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, title, description) {
    const query = `
      UPDATE projects 
      SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [title, description, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = "DELETE FROM projects WHERE id = $1";
    await pool.query(query, [id]);
  }
}

module.exports = Project;
