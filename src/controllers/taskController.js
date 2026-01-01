const Task = require('../models/taskModel');

const TaskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, project_id, assigned_to, due_date } = req.body;

      if (!title || !project_id) {
        return res.status(400).json({
          error: 'Görev başlığı ve proje ID zorunludur.'
        });
      }

      const taskId = await Task.create(
        title,
        description,
        project_id,
        assigned_to,
        due_date
      );

      res.status(201).json({
        message: 'Görev başarıyla eklendi.',
        taskId
      });
    } catch (error) {
      console.error('Create error:', error);
      res.status(500).json({
        error: 'Görev oluşturulurken bir hata oluştu.',
        details: error.message
      });
    }
  },

  getProjectTasks: async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.getByProjectId(projectId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Görevler getirilemedi.' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const {
        title,
        description,
        project_id,
        assigned_to,
        status,
        due_date
      } = req.body;

      if (!title || !project_id || !status) {
        return res.status(400).json({
          error: 'Başlık, proje ve durum zorunludur.'
        });
      }

      const isUpdated = await Task.update(taskId, {
        title,
        description,
        project_id,
        assigned_to,
        status,
        due_date
      });

      if (!isUpdated) {
        return res.status(404).json({ error: 'Görev bulunamadı.' });
      }

      res.status(200).json({
        success: true,
        message: 'Görev başarıyla güncellendi.',
        taskId
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        error: 'Görev güncellenirken bir hata oluştu.',
        details: error.message
      });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          error: 'Yeni durum belirtilmelidir!'
        });
      }

      const isUpdated = await Task.updateStatus(taskId, status);
      if (!isUpdated) {
        return res.status(404).json({ error: 'Görev bulunamadı!' });
      }

      res.status(200).json({
        message: `Görev durumu ${status} olarak değiştirildi`,
        taskId
      });
    } catch (error) {
      console.error('Status update error:', error);
      res.status(500).json({
        error: 'Görev güncellenirken bir hata oluştu!'
      });
    }
  },

  getMyTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await Task.getByUserId(userId);

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      console.error('My tasks error:', error);
      res.status(500).json({
        error: 'Görevleriniz getirilirken bir hata oluştu!'
      });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;

      const isDeleted = await Task.delete(taskId);
      if (!isDeleted) {
        return res.status(404).json({
          error: 'Görev bulunamadı veya zaten silinmiş'
        });
      }

      res.status(200).json({
        message: 'Görev başarılı bir şekilde silindi.',
        taskId
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Görev silinirken hata oluştu',
        details: error.message
      });
    }
  }
};

module.exports = TaskController;
