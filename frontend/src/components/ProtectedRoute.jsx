import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Yükleniyor...</div>;

  // Giriş yapılmamışsa login'e şutla
  if (!user) return <Navigate to="/login" replace />;

  // Admin rotasıysa ve kullanıcı admin değilse (role='employee') engelle
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;