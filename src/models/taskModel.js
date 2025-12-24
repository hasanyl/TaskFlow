const db = require('../config/db');
const { updateStatus } = require('./projectModel');

const Task = {
    /**
     * Belirli bir projeye ait tüm görevleri getirme
     */
    getByProjectId : async (projectId) => {
        const sql = `SELECT t.*, u.fullname as assigned_user
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.project_id`;
        const [rows] = await db.execute(sql, [projectId]);
        return rows;  
    },
    /**
     * Yeni bir görev oluşturma
     */
    create: async (title, description, projectId, assignedTo, dueDate) => {
        const sql = `INSERT INTO tasks (title, description, project_id, assigned_to, due_date) VALUES (?,?,?,?,?)`;
        const [result] = await db.execute(sql, [title, description,projectId,assignedTo, dueDate]);
        return result.insertId;
    },
    /**
     * Görev durumunu güncelleme
     */
    updateStatus: async (taskId, status) => {
        const sql = `UPDATE tasks SET status = ? WHERE id = ?`;
        const [result] = await db.execute(sql, [status, taskId]);
        return result.affectedRows > 0;
    },
    /**
     * Kullanıcının görevlerini görüntüleme
     */
    getByUserId : async (userId) => {
        const sql = `SELECT t.*, p.title as project_title
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.assigned_to = ?
        ORDER BY t.created_at DESC`;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    },
    /**
     * Belirtilen ID'deki görevleri siler.
     * @param {number} taskId - Silinecek görevin ID'si
     */
    delete : async (taskId) => {
        const sql = `DELETE FROM tasks WHERE id = ?`;
        const [result] = await db.execute(sql, [taskId]);
        return result.affectedRows > 0;
    }
};

module.exports = Task;