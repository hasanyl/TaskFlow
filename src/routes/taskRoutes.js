const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const {protect , restrictTo} = require('../middlewares/authMiddleware');

//Yeni görev ekleme (Sadece admin)
router.post('/',protect, restrictTo('admin'), TaskController.createTask);

//Belirli bir projenin görevleri
router.get('/:projectId', protect, TaskController.getProjectTasks);

//Görev durumu güncellemesi
router.patch('/:taskId/status', protect, TaskController.updateTaskStatus);

//Görevlerim kısmının görüntülemesi
router.get('/my/tasks', protect, TaskController.getMyTasks);

//Görev silme (Sadece admin)
router.delete('/:taskId', protect, restrictTo('admin'), TaskController.deleteTask);
module.exports = router;