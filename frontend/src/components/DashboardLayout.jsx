import React from "react";
import { Layout, Button, ConfigProvider, theme } from "antd";
import {
    AppstoreOutlined,
    TeamOutlined,
    StarOutlined,
    SettingOutlined,
    LogoutOutlined,
    RocketOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/admin-dashboard.css";

const { Sider, Content } = Layout;

const DashboardLayout = ({ children, headerActions }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (path) => {
        navigate(path);
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 12,
                    fontFamily: 'Inter, sans-serif',
                }
            }}
        >
            <Layout className="dashboard-layout" style={{ minHeight: "100vh" }}>
                <Sider width={260} className="dashboard-sider">
                    <div className="logo-section">
                        <RocketOutlined /> TaskFlow
                    </div>

                    {/* Common Dashboard Link */}
                    <Button
                        type={location.pathname === "/" ? "primary" : "text"}
                        block
                        icon={<AppstoreOutlined />}
                        onClick={() => handleMenuClick("/")}
                        className="menu-btn"
                        style={{ justifyContent: "flex-start", marginBottom: 8 }}
                    >
                        {user?.role === 'admin' ? 'Yönetici Paneli' : 'Görevlerim'}
                    </Button>

                    {/* Admin Only Links */}
                    {user?.role === 'admin' && (
                        <>
                            <Button
                                type={location.pathname === "/admin/users" ? "primary" : "text"}
                                block
                                icon={<TeamOutlined />}
                                onClick={() => handleMenuClick("/admin/users")}
                                className="menu-btn"
                                style={{ justifyContent: "flex-start", marginBottom: 8 }}
                            >
                                Kullanıcılar
                            </Button>
                            <Button
                                type={location.pathname === "/admin/projects" ? "primary" : "text"}
                                block
                                icon={<StarOutlined />}
                                onClick={() => handleMenuClick("/admin/projects")}
                                className="menu-btn"
                                style={{ justifyContent: "flex-start", marginBottom: 8 }}
                            >
                                Projeler
                            </Button>
                        </>
                    )}

                    <Button
                        type={location.pathname === "/settings" ? "primary" : "text"}
                        block
                        icon={<SettingOutlined />}
                        onClick={() => handleMenuClick("/settings")}
                        className="menu-btn"
                        style={{ justifyContent: "flex-start", marginBottom: 8 }}
                    >
                        Ayarlar
                    </Button>

                    <div style={{ marginTop: "auto" }}>
                        <Button
                            danger
                            type="text"
                            block
                            icon={<LogoutOutlined />}
                            onClick={logout}
                            className="menu-btn"
                            style={{ justifyContent: "flex-start" }}
                        >
                            Çıkış Yap
                        </Button>
                    </div>
                </Sider>

                <Layout style={{ background: 'transparent' }}>
                    <Content className="main-content">
                        <div className="content-header" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div className="welcome-back">Tekrar hoş geldin,</div>
                                <h1 className="page-title">{user?.fullname?.split(" ")[0] || "User"}</h1>
                            </div>
                            {headerActions && <div>{headerActions}</div>}
                        </div>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default DashboardLayout;
