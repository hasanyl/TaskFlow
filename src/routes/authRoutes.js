const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

//POST /api/auth/register
router.post('/register', AuthController.register);

//POST /api/auth/login
router.post('/login', AuthController.login);

//Gizli rota
router.get('/profile', protect, (req, res) => {
    res.json({
        message: "Profile hoş geldin!",
        user: req.user
    });
});

// Profil güncelleme
router.patch('/profile', protect, AuthController.updateProfile);

module.exports = router;