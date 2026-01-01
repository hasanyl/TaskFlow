import React, { useState } from "react";
import { Form, Input, Button, Card, notification } from "antd";
import { UserOutlined, LockOutlined, SaveOutlined } from "@ant-design/icons";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const SettingsPage = () => {
    const { user, setUser } = useAuth();
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const data = await authService.updateProfile({
                fullname: values.fullname,
                password: values.password
            });

            if (data.user) {
                const updatedUser = { ...user, ...data.user };
                setUser(updatedUser);
            }

            api.success({ message: "Profil başarıyla güncellendi!" });
            form.setFieldValue("password", "");
        } catch (err) {
            console.error(err);
            api.error({ message: "Güncelleme başarısız", description: err.response?.data?.error || "Bir hata oluştu" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            {contextHolder}
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <Card title="Hesap Ayarları" bordered={false}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            fullname: user?.fullname,
                            email: user?.email
                        }}
                        onFinish={handleUpdate}
                    >
                        <Form.Item label="E-posta">
                            <Input prefix={<UserOutlined />} disabled value={user?.email} />
                            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>E-posta değiştirilemez.</div>
                        </Form.Item>

                        <Form.Item
                            name="fullname"
                            label="Ad Soyad"
                            rules={[{ required: true, message: "Lütfen adınızı girin" }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Yeni Şifre"
                            extra="Değiştirmek istemiyorsanız boş bırakın."
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Yeni Şifre" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block>
                            Değişiklikleri Kaydet
                        </Button>
                    </Form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
