import React, { useEffect, useState } from "react";
import { Table, Tag, Select, notification, Card, Modal, Descriptions } from "antd";
import {
    ClockCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { employeeService } from "../services/employeeService";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/admin-dashboard.css";

const STATUS_OPTIONS = [
    { label: "Beklemede", value: "pending" },
    { label: "Devam Ediyor", value: "in_progress" },
    { label: "Tamamlandı", value: "completed" }
];

const EmployeeDashboard = () => {
    const [api, contextHolder] = notification.useNotification();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchMyTasks = async () => {
        setLoading(true);
        try {
            const data = await employeeService.getMyTasks();
            setTasks(data || []);
        } catch (err) {
            console.error("Fetch tasks error", err);
            api.error({ message: "Görevler yüklenemedi" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await employeeService.updateTaskStatus(taskId, newStatus);
            api.success({ message: "Task status updated" });
            fetchMyTasks();
        } catch (err) {
            console.error("Update status error", err);
            api.error({ message: "Durum güncellenemedi" });
        }
    };

    const columns = [
        {
            title: "Görev",
            dataIndex: "title",
            key: "title",
            render: (t, r) => (
                <div
                    onClick={() => {
                        setSelectedTask(r);
                        setModalOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                >
                    <div className="task-title" style={{ fontWeight: "bold", fontSize: "16px", color: "#1890ff" }}>{t}</div>
                    <div style={{ color: "#888", fontSize: "12px" }}>{r.project_title}</div>
                    {r.description && <div className="task-description" style={{ marginTop: "4px" }}>{r.description}</div>}
                </div>
            )
        },
        {
            title: "Bitiş Tarihi",
            dataIndex: "due_date",
            key: "due_date",
            render: d => d ? new Date(d).toLocaleDateString() : "-"
        },
        {
            title: "Durum",
            dataIndex: "status",
            key: "status",
            width: 200,
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 160 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                    options={STATUS_OPTIONS}
                />
            )
        },
        {
            title: "Güncel Durum",
            key: "state",
            render: (_, record) => {
                let color = "orange";
                let icon = <ClockCircleOutlined />;
                if (record.status === "in_progress") { color = "blue"; icon = <SyncOutlined spin />; }
                if (record.status === "completed") { color = "green"; icon = <CheckCircleOutlined />; }

                return <Tag icon={icon} color={color}>{record.status.replace("_", " ").toUpperCase()}</Tag>;
            }
        }
    ];

    return (
        <DashboardLayout>
            {contextHolder}
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Görevlerim</h1>
                    <p style={{ color: "#666" }}>Atanmış görevlerini yönet ve durumlarını güncelle.</p>
                </div>

                <Card>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={tasks}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                <Modal
                    title="Görev Detayları"
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                    width={600}
                >
                    {selectedTask && (
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Görev Başlığı">{selectedTask.title}</Descriptions.Item>
                            <Descriptions.Item label="Proje">{selectedTask.project_title}</Descriptions.Item>
                            <Descriptions.Item label="Açıklama">{selectedTask.description || "Açıklama girilmemiş."}</Descriptions.Item>
                            <Descriptions.Item label="Durum">
                                <Tag color={selectedTask.status === "completed" ? "green" : selectedTask.status === "in_progress" ? "blue" : "orange"}>
                                    {selectedTask.status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Bitiş Tarihi">
                                {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Atanma Tarihi">
                                {selectedTask.created_at ? new Date(selectedTask.created_at).toLocaleDateString() : "-"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeDashboard;
