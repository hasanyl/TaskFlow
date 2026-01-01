const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, restrictTo('admin'), TaskController.createTask);
router.patch('/:taskId', protect, restrictTo('admin'), TaskController.updateTask);
router.patch('/:taskId/status', protect, TaskController.updateTaskStatus);
router.get('/my/tasks', protect, TaskController.getMyTasks);
router.delete('/:taskId', protect, restrictTo('admin'), TaskController.deleteTask);
router.get('/project/:projectId', protect, TaskController.getProjectTasks);

module.exports = router;
