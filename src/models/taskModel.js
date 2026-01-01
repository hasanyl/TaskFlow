const db = require('../config/db');

const Task = {
  getByProjectId: async (projectId) => {
    const sql = `
      SELECT 
        t.*,
        u.fullname AS assigned_user
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `;
    const [rows] = await db.execute(sql, [projectId]);
    return rows;
  },

  create: async (title, description, projectId, assignedTo, dueDate) => {
    const sql = `
      INSERT INTO tasks
        (title, description, project_id, assigned_to, due_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title,
      description || null,
      projectId,
      assignedTo || null,
      dueDate || null
    ]);
    return result.insertId;
  },

  update: async (taskId, data) => {
    const {
      title,
      description,
      project_id,
      assigned_to,
      status,
      due_date
    } = data;

    const sql = `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        project_id = ?,
        assigned_to = ?,
        status = ?,
        due_date = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
      title,
      description || null,
      project_id,
      assigned_to || null,
      status,
      due_date || null,
      taskId
    ]);

    return result.affectedRows > 0;
  },

  updateStatus: async (taskId, status) => {
    const sql = `UPDATE tasks SET status = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [status, taskId]);
    return result.affectedRows > 0;
  },

  getByUserId: async (userId) => {
    const sql = `
      SELECT 
        t.*,
        p.title AS project_title
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ?
      ORDER BY t.created_at DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  },

  delete: async (taskId) => {
    const sql = `DELETE FROM tasks WHERE id = ?`;
    const [result] = await db.execute(sql, [taskId]);
    return result.affectedRows > 0;
  }
};

module.exports = Task;
