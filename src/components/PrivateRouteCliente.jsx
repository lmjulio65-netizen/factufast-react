import { Navigate } from 'react-router-dom';

function PrivateRouteCliente({ children }) {
  const cliente = localStorage.getItem("cliente_nit");

  if (!cliente) {
    return <Navigate to="/cliente/login" />;
  }

  return children;
}

export default PrivateRouteCliente;