const Task = require('../models/taskModel');

const TaskController = {
    createTask : async (req, res) => {
        try{
            const {title, description, project_id, assigned_to, due_date} = req.body;
            if(!title || !project_id) return res.status(400).json({error : 'Görev başlığı ve proje ID zorunludur.'});

            const taskId = await Task.create(title, description, project_id, assigned_to, due_date);
            res.status(201).json({
                message : 'Görev başarıyla eklendi.',
                taskId : taskId
            });
        }catch(error){
            res.status(500).json({
                error : 'Görev oluşturulurken bir hata oluştu.',
                details : error.message
            })
        }
    },
    getProjectTasks: async (req, res) => {
        try{
            const {projectId} = req.params; //URL'den ID
            const tasks = await Task.getByProjectId(projectId);
            res.status(200).json(tasks);
        }catch(error){
            res.status(500).json({error : 'Görevler getirilemedi.'});
        }
    },
    updateTaskStatus : async (req,res) => {
        try{
            const {taskId} = req.params;//URL'den taskId
            const {status} = req.body;

            if(!status) return res.status(400).json({error : 'Yeni durum belirtilmelidir!'});
            const isUpdated = await Task.updateStatus(taskId, status);
            if(!isUpdated) return res.status(400).json({error : 'Görev bulunamadı!'});

            res.status(200).json({
                message : `Görev durumu ${status} olarak değiştirildi`,
                taskId : taskId
            });
        }catch(error){
            res.status(500).json({error : 'Görev güncellenirken bir hata oluştu!'});
        }
    },
    getMyTasks: async (req, res) => {
        try{
            const userId = req.user.id;
            const tasks = await Task.getByUserId(userId);

            res.status(200).json({
                success:true,
                count : tasks.length,
                data : tasks
            });
        }catch(error){
            res.status(500).json({error : 'Görevleriniz getirilirken bir hata oluştu!'});
        }
    },
    deleteTask : async (req, res) => {
        try{
            const {taskId} = req.params;

            const isDeleted = await Task.delete(taskId);
            if(!isDeleted) return res.status(404).json({error : 'Görev bulunamadı veya zaten silinmiş'});

            res.status(200).json({
                message : 'Görev başarılı bir şekilde sistemden silindi.',
                taskId : taskId
            });
        }catch(error){
            res.status(500).json({
                error : 'Görev sistemden silinirken bir hata oluştu',
                details : error.message
            })
        }
    }
};

module.exports = TaskController;