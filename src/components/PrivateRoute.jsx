import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, rolPermitido }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  if (!usuario) return <Navigate to="/login" />;

  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/sin-permiso" />;
  }

  return children;
}

export default PrivateRoute;