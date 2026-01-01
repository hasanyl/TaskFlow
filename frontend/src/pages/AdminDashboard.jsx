import React, { useEffect, useState } from "react";
import {
  Tag,
  notification,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Button,
  Popconfirm,
  Avatar,
  Table
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ProjectOutlined
} from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import dayjs from "dayjs";

import { adminService } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import "../styles/admin-dashboard.css";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "Beklemede", value: "pending" },
  { label: "Devam Ediyor", value: "in_progress" },
  { label: "Tamamlandı", value: "completed" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [api, contextHolder] = notification.useNotification();

  const [projectOptions, setProjectOptions] = useState([]);
  const [engineerOptions, setEngineerOptions] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const projRaw = await adminService.getAllProjects();
        const projOpts = (projRaw || []).map(p => ({
          label: p.name ?? p.title ?? `Project ${p.id} `,
          value: String(p.id)
        }));
        setProjectOptions(projOpts);

        const engRaw = await adminService.getEngineers();
        const engOpts = (engRaw || []).map(e => ({
          label: e.fullname ?? e.name ?? `User ${e.id} `,
          value: String(e.id)
        }));
        setEngineerOptions(engOpts);
      } catch (err) {
        console.error("Initial load error", err);
        setProjectOptions([]);
        setEngineerOptions([]);
      }
    };

    loadAll();
  }, []);

  const fetchTasks = async (projectIdString) => {
    if (!projectIdString) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const projectId = parseInt(projectIdString, 10);
      const data = await adminService.getProjectTasks(projectId);
      setTasks(data || []);
    } catch (err) {
      console.error("Fetch tasks error", err);
      api.error({ message: "Görevler yüklenemedi" });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    createForm.resetFields();
    setCreateOpen(true);
  };

  const handleCreate = async (values) => {
    setCreateLoading(true);
    try {
      await adminService.createTask({
        title: values.title,
        description: values.description,
        project_id: parseInt(values.project_id, 10),
        assigned_to: values.assigned_to ? parseInt(values.assigned_to, 10) : null,
        status: values.status ?? "pending",
        due_date: values.due_date ? values.due_date.format("YYYY-MM-DD") : null
      });

      api.success({ message: "Görev oluşturuldu" });
      setCreateOpen(false);
      createForm.resetFields();

      setSelectedProject(values.project_id);
      fetchTasks(values.project_id);
    } catch (err) {
      console.error("Create error", err);
      api.error({ message: "Task oluşturulamadı" });
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  useEffect(() => {
    if (!editingTask) return;
    if (projectOptions.length === 0 || engineerOptions.length === 0) return;

    editForm.setFieldsValue({
      title: editingTask.title,
      description: editingTask.description,
      project_id: String(editingTask.project_id),
      assigned_to: editingTask.assigned_to ? String(editingTask.assigned_to) : null,
      status: editingTask.status ?? "pending",
      due_date: editingTask.due_date ? dayjs(editingTask.due_date) : null
    });
  }, [editingTask, projectOptions, engineerOptions, editForm]);

  const handleUpdate = async (values) => {
    if (!editingTask) return;
    setEditLoading(true);
    try {
      await adminService.updateTask(editingTask.id, {
        title: values.title,
        description: values.description,
        project_id: parseInt(values.project_id, 10),
        assigned_to: values.assigned_to ? parseInt(values.assigned_to, 10) : null,
        status: values.status,
        due_date: values.due_date ? values.due_date.format("YYYY-MM-DD") : null
      });

      api.success({ message: "Görev güncellendi" });
      setEditOpen(false);
      setEditingTask(null);
      fetchTasks(selectedProject);
    } catch (err) {
      console.error("Update error", err);
      api.error({ message: "Güncelleme sırasında hata" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteTask(id);
      api.success({ message: "Görev silindi" });
      fetchTasks(selectedProject);
    } catch (err) {
      console.error("Delete error", err);
      api.error({ message: "Silme başarısız" });
    }
  };


  const columns = [
    {
      title: "Görev",
      dataIndex: "title",
      render: (t, r) => (
        <div>
          <div className="task-title">{t}</div>
          {r.description && <div className="task-description">{r.description}</div>}
        </div>
      )
    },
    {
      title: "Atanan Kişi",
      dataIndex: "assigned_to",
      render: id => {
        const eng = engineerOptions.find(e => e.value === String(id));
        return eng ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar>{(eng.label || "U")[0]}</Avatar>
            <span>{eng.label}</span>
          </div>
        ) : <span style={{ color: "#94a3b8" }}>Atanmamış</span>;
      }
    },
    {
      title: "Durum",
      dataIndex: "status",
      render: s => (
        <Tag color={s === "completed" ? "green" : s === "in_progress" ? "blue" : "orange"}>
          {String(s).replace("_", " ")}
        </Tag>
      )
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Görevi sil?" onConfirm={() => handleDelete(record.id)}>
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
          onClick={openCreateModal}
          className="create-task-btn"
        >
          Görev Oluştur
        </Button>
      }
    >
      {contextHolder}

      <Select
        size="large"
        placeholder="Proje Seç"
        options={projectOptions}
        value={selectedProject}
        style={{ width: 320, marginBottom: 24 }}
        onChange={(v) => {
          setSelectedProject(v);
          fetchTasks(v);
        }}
        allowClear
      />

      <div className="tasks-section">
        <Table rowKey="id" columns={columns} dataSource={tasks} loading={loading} pagination={{ pageSize: 6 }} />
      </div>

      <Modal
        open={createOpen}
        destroyOnClose
        footer={null}
        title="Yeni Görev Oluştur"
        onCancel={() => {
          createForm.resetFields();
          setCreateOpen(false);
        }}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Görev Başlığı" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Açıklama">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="project_id" label="Proje" rules={[{ required: true }]}>
            <Select options={projectOptions} placeholder="Select project" />
          </Form.Item>

          <Form.Item name="assigned_to" label="Atanan Kişi">
            <Select allowClear options={engineerOptions} placeholder="Select engineer" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="due_date" label="Bitiş Tarihi">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button htmlType="submit" type="primary" block loading={createLoading}>Oluştur</Button>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        destroyOnClose
        footer={null}
        title="Görevi Düzenle"
        onCancel={() => {
          editForm.resetFields();
          setEditOpen(false);
          setEditingTask(null);
        }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="title" label="Görev Başlığı" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Açıklama">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="project_id" label="Proje" rules={[{ required: true }]}>
            <Select options={projectOptions} placeholder="Select project" />
          </Form.Item>

          <Form.Item name="assigned_to" label="Assign To">
            <Select allowClear options={engineerOptions} placeholder="Select engineer" />
          </Form.Item>

          <Form.Item name="status" label="Durum" rules={[{ required: true }]}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="due_date" label="Bitiş Tarihi">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button htmlType="submit" type="primary" block loading={editLoading}>Güncelle</Button>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
