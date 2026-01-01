const User = require('../models/userModel');

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({
                error: 'Kullanıcılar getirilirken bir hata oluştu.',
                details: error.message
            });
        }
    },

    getAllEmployees: async (req, res) => {
        try {
            const employees = await User.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({
                error: 'Çalışanlar getirilirken bir hata oluştu.',
                details: error.message
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({
                error: 'Kullanıcı getirilirken bir hata oluştu.',
                details: error.message
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const updatedUser = await User.update(userId, req.body);
            res.status(200).json({ message: 'Kullanıcı güncellendi', data: updatedUser });
        } catch (error) {
            res.status(500).json({
                error: 'Kullanıcı güncellenirken hata oluştu.',
                details: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            await User.delete(userId);
            res.status(200).json({ message: 'Kullanıcı silindi' });
        } catch (error) {
            res.status(500).json({
                error: 'Kullanıcı silinirken hata oluştu.',
                details: error.message
            });
        }
    }
};

module.exports = UserController;