const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

//Tüm üyeler projeleri görebilir
router.get('/', protect, ProjectController.getAllProjects);

//Sadece adminler yeni proje oluşturabilir, düzenleyebilir veya silebilir
router.post('/', protect, restrictTo('admin'), ProjectController.createProject);
router.patch('/:id', protect, restrictTo('admin'), ProjectController.updateProject);
router.delete('/:id', protect, restrictTo('admin'), ProjectController.deleteProject);

module.exports = router;