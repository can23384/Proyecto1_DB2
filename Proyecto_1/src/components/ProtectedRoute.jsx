import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(usuario.rol)) {
    if (usuario.rol === 'owner') {
      return <Navigate to="/owner" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}