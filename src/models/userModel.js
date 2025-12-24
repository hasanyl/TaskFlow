const db = require("../config/db");

const User = {
    /**
     * Yeni bir kullanıcı oluşturma
     * @param {string} fullname - Kullanıcının adı soyadı
     * @param {string} email - Kullanıcının eposta adresi
     * @param {string} password - Kullanıcının hashlenmiş şifresi
     * @param {string} role - 'admin' veya 'employee'
     */
    create: async (fullname, email, password, role) =>{
        const sql = `INSERT INTO users (fullname, email, password, role) VALUES (?,?,?,?)`;
        const [result] = await db.execute(sql, [fullname, email, password, role]);
        return result.insertId;
    },
    /**
     * @param {string} email
     */
    findByEmail: async (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
    },
    /**
     * @param {number} id
     */
    findById: async (id) => {
        const sql = `SELECT id, fullname, email , role, created_at FROM users WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
};

module.exports = User;