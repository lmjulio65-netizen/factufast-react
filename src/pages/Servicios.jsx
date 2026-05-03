import './Servicio.css';

import React from 'react';

import { Link } from 'react-router-dom';

import fondo from '../assets/factura.png';
import logo from '../assets/logo.jpg';
import salida from '../assets/salida.png';

function Servicios() {
  return (
    <div
      className="servicios-container"
      style={{ backgroundImage: `url(${fondo})` }}
    >

      {/* HEADER */}
      <header className="header">

        <div className="header-left">
          <img src={logo} alt="logo" className="logo" />

          <div>
            <h1>FACTUFAST</h1>
            <p>Sistema profesional de facturación e inventario</p>
          </div>
        </div>

        <Link to="/" className="btn-exit">
          <img src={salida} alt="Salir" />
        </Link>

      </header>


      {/* TITULO */}
      <section className="intro">

        <h2>¿Qué ofrece FACTUFAST?</h2>

        <p>
          FACTUFAST es un sistema diseñado para facilitar la gestión de
          negocios. Permite administrar ventas, productos, clientes y
          reportes de manera rápida y organizada desde una sola plataforma.
        </p>

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


      {/* FOOTER */}
      <footer className="footer-servicios">

        <p>Contacto: 3024698432</p>
        <p>© 2026 FACTUFAST - Todos los derechos reservados</p>
        <p>Autores: Luz Mery Julio - Monica Medina</p>

      </footer>

    </div>
  );
}

export default Servicios;