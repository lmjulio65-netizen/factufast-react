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
           {/* <Link to="/registro">
              <button className="btn-secondary">Registrarse</button>
            </Link>*/}
            <Link to="/servicios">
              <button className="btn-secondary">Servicios</button>
            </Link>
            {/* 👤 NUEVO */}
            <Link to="/cliente/login">
              <button className="btn-cliente">Portal Cliente</button>
            </Link>
          </div>
        </div>

      </section>

      <section className="services">
        <h2>Servicios del Sistema</h2>
        <div className="services-container">
          <div className="card">
            <h3>Facturación</h3>
            <p>Genera facturas rápidas y seguras para tus clientes.</p>
          </div>
          <div className="card">
            <h3>Inventario</h3>
            <p>Controla productos y existencias en tiempo real.</p>
          </div>
          <div className="card">
            <h3>Clientes</h3>
            <p>Administra la información completa de tus clientes.</p>
          </div>
          <div className="card">
            <h3>Reportes</h3>
            <p>Obtén reportes claros sobre ventas y rendimiento.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Contacto: 3024698432</p>
        <p>2026 TODOS LOS DERECHOS RESERVADOS</p>
        <p>AUTORES: LUZ MERY JULIO - MONICA MEDINA</p>
      </footer>
    </div>
  );
}

export default Home;