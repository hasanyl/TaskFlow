import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Avatar, Button, Modal, Form, Input, Select, Popconfirm, notification } from "antd";
import { TeamOutlined, UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import { adminService } from "../services/adminService";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data || []);
        } catch (err) {
            console.error("Failed to load users", err);
            api.error({ message: "Kullanıcılar yüklenemedi" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        editForm.setFieldsValue({
            fullname: user.fullname,
            email: user.email,
            role: user.role
        });
        setEditOpen(true);
    };

    const handleUpdate = async (values) => {
        try {
            await adminService.updateUser(editingUser.id, values);
            api.success({ message: "Kullanıcı güncellendi" });
            setEditOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            api.error({ message: "Güncelleme başarısız" });
        }
    };

    const handleDelete = async (userId) => {
        try {
            await adminService.deleteUser(userId);
            api.success({ message: "Kullanıcı silindi" });
            fetchUsers();
        } catch (err) {
            api.error({ message: "Silme başarısız" });
        }
    };

    const columns = [
        {
            title: "Kullanıcı",
            dataIndex: "fullname",
            key: "fullname",
            render: (text) => (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </div>
            )
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Rol",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={role === "admin" ? "purple" : "blue"}>
                    {role.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Katılma Tarihi",
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            title: "İşlemler",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Kullanıcıyı sil?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <DashboardLayout>
            {contextHolder}
            <Card title={<><TeamOutlined /> Tüm Kullanıcılar</>} bordered={false}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title="Kullanıcı Düzenle"
                open={editOpen}
                onCancel={() => {
                    setEditOpen(false);
                    setEditingUser(null);
                }}
                footer={null}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item name="fullname" label="Ad Soyad" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
                        <Select options={[
                            { label: 'Admin', value: 'admin' },
                            { label: 'Employee', value: 'employee' }
                        ]} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Güncelle</Button>
                </Form>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminUsers;
