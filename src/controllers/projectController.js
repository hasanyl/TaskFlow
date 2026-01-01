const Project = require('../models/projectModel');

const ProjectController = {
    getAllProjects: async (req, res) => {
        try {
            const projects = await Project.getAll();

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({
                error: "Projeler getirilirken bir hata oluştu!",
                details: error.message
            });
        }
    },

    createProject: async (req, res) => {
        try {
            const { name, description } = req.body;
            const manager_id = req.user.id;

            if (!name) return res.status(400).json({ error: "Proje adı zorunludur!" });

            const projectId = await Project.create(name, description, manager_id);

            res.status(201).json({
                message: 'Proje başarıyla oluşturuldu.',
                projectId: projectId,
                manager: manager_id
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                error: "Proje oluşturulurken bir hata oluştu.",
                details: error.message
            });
        }
    },

    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const success = await Project.update(id, name, description);
            if (!success) return res.status(404).json({ error: "Proje bulunamadı." });

            res.json({ message: "Proje güncellendi." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Güncelleme hatası" });
        }
    },

    deleteProject: async (req, res) => {
        try {
            const { id } = req.params;
            const success = await Project.delete(id);
            if (!success) return res.status(404).json({ error: "Proje bulunamadı." });

            res.json({ message: "Proje silindi." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Silme hatası (Bağlı görevler olabilir)" });
        }
    }
};

module.exports = ProjectController;
