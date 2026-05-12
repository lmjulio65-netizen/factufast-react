import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

function Sidebar() {

  const navigate = useNavigate();
  const usuario  = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol      = usuario.rol || "";

  const esGerente  = rol === "Gerente 1";
  const esAdmin    = rol === "Administrador";
  const esEmpleado = rol === "Empleado";

  const base = esGerente ? "/gerente" : esAdmin ? "/admin" : "/empleado";

  return (
    <div style={{
      width:"220px", background:"#3b3b1f", color:"white",
      padding:"20px", minHeight:"100vh",
      display:"flex", flexDirection:"column"
    }}>

      <nav style={{ display:"flex", flexDirection:"column", gap:"8px" }}>

        {/* GERENTE */}
        {esGerente && (
          <>
            <NavLink style={estiloLink} to={`${base}/configuracion`}>⚙ Configuración</NavLink>
            <NavLink style={estiloLink} to={`${base}/reportes`}>📊 Reportes</NavLink>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦 Inventario</NavLink>
            <NavLink style={estiloLink} to={`${base}/productos`}>🛒 Productos</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥 Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/proveedores`}>🏭 Proveedores</NavLink>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾 Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/listado-facturas`}>📋 Listado Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/gastos`}>💸 Gastos</NavLink>
            <NavLink style={estiloLink} to={`${base}/terceros`}>👤 Terceros</NavLink>
            <NavLink style={estiloLink} to={`${base}/creditos`}>💳 Créditos</NavLink>
            <NavLink style={estiloLink} to="/registro">➕ Registrar usuario</NavLink>
            <NavLink style={estiloLink} to={`${base}/ventas-historicas`}>🧾 Ventas Históricas</NavLink>
            <NavLink style={estiloLink} to={`${base}/ventas-historicas`}>🧾 Ventas Históricas</NavLink>

          </>
        )}

        {/* ADMINISTRADOR */}
        {esAdmin && (
          <>
            <NavLink style={estiloLink} to={`${base}/reportes`}>📊 Reportes</NavLink>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦 Inventario</NavLink>
            <NavLink style={estiloLink} to={`${base}/productos`}>🛒 Productos</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥 Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/proveedores`}>🏭 Proveedores</NavLink>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾 Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/listado-facturas`}>📋 Listado Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/gastos`}>💸 Gastos</NavLink>
            <NavLink style={estiloLink} to={`${base}/creditos`}>💳 Créditos</NavLink>
            <NavLink style={estiloLink} to={`${base}/ventas-historicas`}>🧾 Ventas Históricas</NavLink>
          </>
        )}

        {/* EMPLEADO */}
        {esEmpleado && (
          <>
            <NavLink style={estiloLink} to={`${base}/facturas`}>🧾 Facturas</NavLink>
            <NavLink style={estiloLink} to={`${base}/clientes`}>👥 Clientes</NavLink>
            <NavLink style={estiloLink} to={`${base}/proveedores`}>🏭 Proveedores</NavLink>
            <NavLink style={estiloLink} to={`${base}/productos`}>🛒 Productos</NavLink>
            <NavLink style={estiloLink} to={`${base}/inventario`}>📦 Inventario</NavLink>
          </>
        )}

      </nav>

    </div>
  );
}

const estiloLink = ({ isActive }) => ({
  textDecoration: "none",
  color:          "white",
  padding:        "8px 10px",
  borderRadius:   "6px",
  background:     isActive ? "#8a7500" : "transparent",
  fontWeight:     isActive ? "bold" : "normal",
  fontSize:       "14px"
});

export default Sidebar;