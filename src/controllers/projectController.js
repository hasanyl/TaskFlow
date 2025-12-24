const Project = require('../models/projectModel');

const ProjectController = {
    /**
     * Tüm projeleri listeleme
     */
    getAllProjects: async (req, res) => {
        try{
            const projects = await Project.getAll;

            res.status(200).json({
                success : true,
                count : projects.length,
                data : projects
            });
        }catch(error){
            res.status(500).json({
                error : "Projeler getirilirken bir hata oluştu!"
            });
        }
    },
    /**
     * Yeni proje oluşturma
     */
    createProject: async (req,res) => {
        try{
            const {name, description} = req.body;
            const manager_id = req.user.id;

            if(!name) return res.status(400).json({error : "Proje adı zorunludur!"});
            const projectId = await Project.create(name,description, manager_id);
            res.status(201).json({
                message : 'Proje başarıyla oluşturuldu.',
                projectId : projectId,
                manager : manager_id
            });
        }catch(error){
            res.status(500).json({
                error : "Proje oluşturulurken bir hata oluştu.",
                details : error.message
            });
        }
    }
};

module.exports = ProjectController;