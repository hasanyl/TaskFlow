const db = require('../config/db');

const Project = {
    /**
     * Tüm projeleri listeleme
     */
    getAll: async () => {
        const sql = `SELECT * FROM projects ORDER BY created_at DESC`;
        const [rows] = await db.execute(sql);
        return rows;
    },
    /**
     * Yeni bir proje oluşturma
     * @param {string} name - Proje Adı
     * @param {string} description - Proje Açıklaması
     */
    create: async(name, description, manager_id) => {
        const sql = `INSERT INTO projects (title,description, manager_id) VALUES (?,?,?)`;
        const [result] = await db.execute(sql, [name, description, manager_id]);
        return result.insertId;
    },
    /**
     * ID'ye göre proje getirme
     */
    getById: async (id) => {
        const sql = `SELECT * FROM projects WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },
    /**
     * Proje durumunu güncelleme
     */
    updateStatus : async (id, status) => {
        const sql = `UPDATE projects SET status = ? WHERE id = ?`;
        const [result] = await db.execute(sql, [status, id]);
        return result.affectedRows > 0; // Güncelleme başarılı ise true dönecek.
    }
};

module.exports = Project;