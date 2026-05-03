import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import PrivateRouteCliente from './components/PrivateRouteCliente';
import Register from './components/Register';
import DashboardLayout from './layout/DashboardLayout';
import Ayuda from './pages/Ayuda';
import ClienteFacturaDetalle from './pages/ClienteFacturaDetalle';
import ClienteFacturas from './pages/ClienteFacturas';
import ClienteLogin from './pages/ClienteLogin';
import Clientes from './pages/Clientes';
import Configuracion from './pages/Configuracion';
import Dashboard from './pages/Dashboard';
import FacturaAnular from './pages/FacturaAnular';
import Facturas from './pages/Facturas';
import FacturaVista from './pages/FacturaVista';
import Gerente from './pages/Gerente';
import Home from './pages/Home';
import Inventario from './pages/Inventario';
import ListadoFacturas from './pages/ListadoFacturas';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores';
import RecuperarClave from './pages/RecuperarClave';
import RecuperarUsuario from './pages/RecuperarUsuario';
import Reportes from './pages/Reportes';
import Servicios from './pages/Servicios';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PÚBLICAS */}
        <Route path="/"                  element={<Home />} />
        <Route path="/servicios"         element={<Servicios />} />
        <Route path="/ayuda"             element={<Ayuda />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/recuperar-usuario" element={<RecuperarUsuario />} />
        <Route path="/recuperar-clave"   element={<RecuperarClave />} />

        {/* 🔒 Registro solo para gerente */}
        <Route path="/registro" element={
          <PrivateRoute rolPermitido="Gerente 1">
            <Register />
          </PrivateRoute>
        }/>

        {/* 🚫 Sin permiso */}
        <Route path="/sin-permiso" element={
          <div style={{ textAlign:"center", marginTop:"100px" }}>
            <h2>🚫 No tienes permiso para ver esta página</h2>
            <a href="/login">← Volver al inicio</a>
          </div>
        }/>

        {/* 👤 PORTAL CLIENTE */}
        <Route path="/cliente/login" element={<ClienteLogin />} />
        <Route path="/cliente/facturas" element={
          <PrivateRouteCliente><ClienteFacturas /></PrivateRouteCliente>
        }/>
        <Route path="/cliente/factura/:id" element={
          <PrivateRouteCliente><ClienteFacturaDetalle /></PrivateRouteCliente>
        }/>

        {/* 🧾 FACTURAS FUERA DEL PANEL */}
        <Route path="/factura/:id"          element={<FacturaVista />} />
        <Route path="/factura/anular/:id"   element={<FacturaAnular />} />

        {/* 🧑‍💼 PANEL GERENTE */}
        <Route path="/gerente" element={
          <PrivateRoute rolPermitido="Gerente 1">
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index                    element={<Gerente />} />
          <Route path="dashboard"         element={<Dashboard />} />
          <Route path="facturas"          element={<Facturas />} />
          <Route path="listado-facturas"  element={<ListadoFacturas />} />
          <Route path="productos"         element={<Productos />} />
          <Route path="inventario"        element={<Inventario />} />
          <Route path="reportes"          element={<Reportes />} />
          <Route path="clientes"          element={<Clientes />} />
          <Route path="configuracion"     element={<Configuracion />} />
          <Route path="proveedores"       element={<Proveedores />} />
        </Route>

        {/* 🧑‍💻 PANEL ADMINISTRADOR */}
        <Route path="/admin" element={
          <PrivateRoute rolPermitido="Administrador">
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index                    element={<Reportes />} />
          <Route path="reportes"          element={<Reportes />} />
          <Route path="facturas"          element={<Facturas />} />
          <Route path="listado-facturas"  element={<ListadoFacturas />} />
          <Route path="productos"         element={<Productos />} />
          <Route path="inventario"        element={<Inventario />} />
          <Route path="clientes"          element={<Clientes />} />
          <Route path="proveedores"       element={<Proveedores />} />
        </Route>

        {/* 👨‍🔧 PANEL EMPLEADO */}
        <Route path="/empleado" element={
          <PrivateRoute rolPermitido="Empleado">
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index            element={<Facturas />} />
          <Route path="facturas"  element={<Facturas />} />
          <Route path="clientes"  element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="inventario"  element={<Inventario />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;