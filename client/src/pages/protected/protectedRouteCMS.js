import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const role = sessionStorage.getItem('role');

    // Check if the role is 'admin'
    if (role === 'admin') {
        return element;
    }
    
    return <Navigate to="/cms" replace />;
};

export default ProtectedRoute;
