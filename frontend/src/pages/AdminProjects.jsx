import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, notification, Card, Popconfirm } from "antd";
import { PlusOutlined, ProjectOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import { adminService } from "../services/adminService";
import { useAuth } from "../context/AuthContext";

const { TextArea } = Input;

const AdminProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const [createOpen, setCreateOpen] = useState(false);
    const [createForm] = Form.useForm();
    const [createLoading, setCreateLoading] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [editingProject, setEditingProject] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllProjects();
            setProjects(data || []);
        } catch (err) {
            api.error({ message: "Projeler yüklenemedi" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (values) => {
        setCreateLoading(true);
        try {
            await adminService.createProject({
                name: values.name,
                description: values.description,
                manager_id: user.id
            });
            api.success({ message: "Proje oluşturuldu!" });
            setCreateOpen(false);
            createForm.resetFields();
            fetchProjects();
        } catch (err) {
            console.error(err);
            api.error({ message: "Proje oluşturulamadı." });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        setEditLoading(true);
        try {
            await adminService.updateProject(editingProject.id, {
                name: values.name,
                description: values.description
            });
            api.success({ message: "Proje güncellendi!" });
            setEditOpen(false);
            setEditingProject(null);
            fetchProjects();
        } catch (err) {
            console.error(err);
            api.error({ message: "Proje güncellenemedi." });
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await adminService.deleteProject(id);
            api.success({ message: "Proje silindi!" });
            fetchProjects();
        } catch (err) {
            console.error(err);
            api.error({ message: "Proje silinemedi (Bağlı görevler olabilir)." });
        }
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        editForm.setFieldsValue({
            name: project.title,
            description: project.description
        });
        setEditOpen(true);
    };

    const columns = [
        {
            title: "Proje Adı",
            dataIndex: "title",
            key: "title",
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
        },
        {
            title: "Açıklama",
            dataIndex: "description",
            key: "description",
            render: (text) => <div className="text-wrap-cell">{text}</div>
        },
        {
            title: "Oluşturulma Tarihi",
            dataIndex: "created_at",
            key: "created_at",
            render: (d) => new Date(d).toLocaleDateString()
        },
        {
            title: "İşlemler",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Popconfirm
                        title="Projeyi silmek istediğine emin misin?"
                        description="Bu işlem geri alınamaz."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <DashboardLayout
            headerActions={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateOpen(true)}
                >
                    Yeni Proje
                </Button>
            }
        >
            {contextHolder}
            <Card title={<><ProjectOutlined /> Tüm Projeler</>} bordered={false}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={projects}
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title="Yeni Proje Oluştur"
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="name" label="Proje Adı" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Website Redesign" />
                    </Form.Item>
                    <Form.Item name="description" label="Açıklama">
                        <TextArea rows={3} placeholder="Project details..." />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={createLoading}>
                        Oluştur
                    </Button>
                </Form>
            </Modal>

            <Modal
                title="Projeyi Düzenle"
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item name="name" label="Proje Adı" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Açıklama">
                        <TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={editLoading}>
                        Güncelle
                    </Button>
                </Form>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminProjects;
