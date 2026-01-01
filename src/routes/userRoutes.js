const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');


router.get('/', protect, restrictTo('admin'), UserController.getAllUsers);
router.get('/employees', protect, restrictTo('admin'), UserController.getAllEmployees);
router.get('/:userId', protect, restrictTo('admin'), UserController.getUserById);
router.patch('/:userId', protect, restrictTo('admin'), UserController.updateUser);
router.delete('/:userId', protect, restrictTo('admin'), UserController.deleteUser);

module.exports = router;