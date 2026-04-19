import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function RoleRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    const userRoles = user?.roles || [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
    return children;
}