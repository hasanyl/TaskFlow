const db = require("../config/db");

const User = {
    /**
     * Yeni bir kullanıcı oluşturma
     * @param {string} fullname - Kullanıcının adı soyadı
     * @param {string} email - Kullanıcının eposta adresi
     * @param {string} password - Kullanıcının hashlenmiş şifresi
     * @param {string} role - 'admin' veya 'employee'
     */
    create: async (fullname, email, password, role) => {
        const sql = `INSERT INTO users (fullname, email, password, role) VALUES (?,?,?,?)`;
        const [result] = await db.execute(sql, [fullname, email, password, role]);
        return result.insertId;
    },

    /**
     * Email'e göre kullanıcı bulma
     * @param {string} email
     */
    findByEmail: async (email) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },

    /**
     * ID'ye göre kullanıcı bulma
     * @param {number} id
     */
    findById: async (id) => {
        const sql = `SELECT id, fullname, email, role, created_at FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    /**
     * TÜM kullanıcıları getir
     * @returns {Array} Tüm kullanıcılar
     */
    getAll: async () => {
        const sql = `
            SELECT id, fullname, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Sadece employee ve admin kullanıcıları getir
     * @returns {Array} Employee ve admin kullanıcılar
     */
    getAllEmployees: async () => {
        const sql = `
            SELECT id, fullname, email, role, created_at 
            FROM users 
            WHERE role IN ('employee', 'admin')
            ORDER BY fullname ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    /**
     * Kullanıcı güncelleme
     * @param {number} id
     * @param {Object} userData
     */
    update: async (id, { fullname, email, password, role }) => {
        let sql = `UPDATE users SET fullname = ?, email = ?, role = ?`;
        const params = [fullname, email, role];

        if (password) {
            sql += `, password = ?`;
            params.push(password);
        }

        sql += ` WHERE id = ?`;
        params.push(id);

        await db.execute(sql, params);
        return { id, fullname, email, role };
    },

    /**
     * Kullanıcı silme
     * @param {number} id
     */
    delete: async (id) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        await db.execute(sql, [id]);
        return true;
    }
};

module.exports = User;