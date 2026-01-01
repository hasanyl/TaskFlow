import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Sayfalarımız
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminUsers from './pages/AdminUsers';
import SettingsPage from './pages/SettingsPage';

/**
 * DashboardSelector: Giriş yapmış kullanıcının rolüne göre 
 * hangi Dashboard'u göreceğini belirleyen ana bileşen kanka.
 */
const DashboardSelector = () => {
  const { user } = useAuth();

  // Veritabanındaki 'role' değerine göre yönlendirme yapılır
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
};

// App entry point
function App() {
  return (
    <AuthProvider> {/* Uygulamayı yetkilendirme hafızasıyla sarmalıyoruz */}
      <Router>
        <Routes>
          {/* Herkese Açık Rotalar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Korumalı Ana Rota: Sadece giriş yapanlar girebilir */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardSelector />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Sadece Adminlerin girebileceği ekstra bir korumalı yol istersen kanka: */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Tanımsız rotaları ana sayfaya (dolayısıyla korumaya) yönlendir kanka */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;