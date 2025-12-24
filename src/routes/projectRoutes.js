const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

//Tüm üyeler projeleri görebilir
router.get('/', protect, ProjectController.getAllProjects);

//Sadece adminler yeni proje oluşturabilir
router.post('/', protect, restrictTo('admin'), ProjectController.createProject);

module.exports = router;