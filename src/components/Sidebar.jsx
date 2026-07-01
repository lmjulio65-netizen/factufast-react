import "./Sidebar.css";
import { useState } from "react";
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

function Sidebar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol = usuario.rol || "";

  const esGerente      = rol === "Gerente 1";
  const esAdmin        = rol === "Administrador";
  const esEmpleado     = rol === "Empleado";

  // Base de ruta según rol
  const base = esGerente ? "/gerente" : esAdmin ? "/admin" : "/empleado";

  const cerrarSesion = () => {
    if (!window.confirm("¿Estás seguro que deseas cerrar sesión?")) return;
    localStorage.removeItem("usuario");
    navigate("/login");
  };

const toggleMenu = () => setMenuAbierto(!menuAbierto);

return (
  <>
    <button
      onClick={toggleMenu}
      className="hamburguesa"
    >
      ☰
    </button>

    <div
      className={`sidebar ${menuAbierto ? "activo" : ""}`}
      style={{
        width: "220px",
        background: "#3b3b1f",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px"
      }}
    >

      <nav style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* GERENTE — menú completo */}
        {esGerente && (
          <>
            <NavLink style={estiloLink} to={`${base}/proveedores`}>🚚Proveedores</NavLink>
            <NavLink style={estiloLink} to={`${base}/productos`}>🛍️Productos</NavLink>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦Inventario</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/listado-facturas`}>📄Listado Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/reportes`}>📊Reportes</NavLink>
            <NavLink style={estiloLink} to={`${base}/configuracion`}>⚙️Usuarios</NavLink>
          </>
        )}

        {/* ADMINISTRADOR — menú completo sin permisos de anulación */}
        {esAdmin && (
          <>
            <NavLink style={estiloLink} to={`${base}/proveedores`}>🚚Proveedores</NavLink>
            <NavLink style={estiloLink} to={`${base}/productos`}>🛍️Productos</NavLink>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦Inventario</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/listado-facturas`}>📄Listado Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/reportes`}>📊Reportes</NavLink>
            <NavLink style={estiloLink} to={`${base}/configuracion`}>⚙️Usuarios</NavLink>
          </>
        )}

        {/* EMPLEADO — solo consulta de inventario, clientes, facturas y listado */}
        {esEmpleado && (
          <>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦Inventario</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/listado-facturas`}>📄Listado Facturas</NavLink>
          </>
        )}

      </nav>


        </div>
   </>
);
}

const estiloLink = ({ isActive }) => ({
  textDecoration: "none",
  color: "white",
  padding: "8px",
  borderRadius: "5px",
  background: isActive ? "#8a7500" : "transparent",
  fontWeight: isActive ? "bold" : "normal"
});

export default Sidebar;