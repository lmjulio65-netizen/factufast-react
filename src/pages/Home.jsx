import './Home.css';

import React from 'react';

import { Link } from 'react-router-dom';

import logo from '../assets/logo.png';

function Home() {
  return (
    <div className="home">
      <section className="hero">

        <div className="top-bar">
          <img src={logo} alt="logo" className="logo-img"/>
          <div className="title-container">
            <h1 className="logo-text">FACTUFAST</h1>
            <p className="slogan">Sistema profesional de facturación e inventario</p>
          </div>
        </div>

        <div className="hero-content">
          <div className="buttons">
            <Link to="/login">
              <button className="btn-primary">Iniciar Sesión</button>
            </Link>
           {/*
<Link to="/registro">
  <button className="btn-secondary">Registrarse</button>
</Link>
*/}
            <Link to="/cliente/login">
              <button className="btn-cliente">Portal Cliente</button>
            </Link>
          </div>
        </div>

      </section>

      {/* SERVICIOS */}
      <section className="servicios">

        <div className="servicios-grid">

          <div className="servicio-card">
            <h3>Facturación rápida</h3>

            <ul>
              <li>Crear facturas en segundos</li>
              <li>Registro automático de ventas</li>
              <li>Control de pagos</li>
            </ul>

          </div>

          <div className="servicio-card">
            <h3>Control de inventario</h3>

            <ul>
              <li>Administrar productos</li>
              <li>Control de stock</li>
              <li>Entradas y salidas de inventario</li>
            </ul>

          </div>

          <div className="servicio-card">
            <h3>Gestión de clientes</h3>

            <ul>
              <li>Registro de clientes</li>
              <li>Historial de compras</li>
              <li>Datos organizados</li>
            </ul>

          </div>

          <div className="servicio-card">
            <h3>Reportes inteligentes</h3>

            <ul>
              <li>Reportes de ventas</li>
              <li>Análisis del negocio</li>
              <li>Información para decisiones</li>
            </ul>

          </div>

        </div>

      </section>

      <footer className="footer">
        <p>CONTACTO: 3024698432 / 3144571556</p>
        <p>2026 TODOS LOS DERECHOS RESERVADOS</p>
        <p>AUTORES: LUZ MERY JULIO - MONICA MEDINA</p>
      </footer>
    </div>
  );
}

export default Home;