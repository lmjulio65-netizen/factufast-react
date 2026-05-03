import './Login.css';

import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import logo from '../assets/logo.png';

function Login() {

  const [usuario, setUsuario]     = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("usuario", usuario);
    formData.append("contrasena", contrasena);

    try {
      const response = await fetch("http://localhost/factufast-api/login.php", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.success) {

        // ✅ Guardar TODO en un solo objeto
        const usuarioObj = {
          id:     data.id_usuario,
          nombre: data.nombre_usuario,
          rol:    data.nombre_rol
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioObj));

        // ✅ Cada rol va a su propia ruta
        const rol = data.nombre_rol;

        if (rol === "Gerente 1") {
          navigate("/gerente");
        } else if (rol === "Administrador") {
          navigate("/admin");
        } else if (rol === "Empleado") {
          navigate("/empleado");
        } else {
          navigate("/");
        }

      } else {
        alert(data.mensaje);
      }

    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div className="login-container">

      <header className="login-header">
        <img src={logo} alt="logo" className="login-logo"/>
        <h1>Bienvenido a FACTUFAST</h1>
        <p>Facturación rápida, negocios sin límites</p>
      </header>

      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>

          <h2>Iniciar Sesión</h2>

          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Ingresar
          </button>

          <div style={{ marginTop: "10px" }}>
            <a href="/recuperar-usuario">¿Olvidaste tu usuario?</a>
            <br/>
            <a href="/recuperar-clave">¿Olvidaste tu contraseña?</a>
          </div>

          <div className="login-links">
            <Link to="/">Salir</Link>
          </div>

        </form>
      </div>

      <footer className="login-footer">
        <p>Contacto: 3024698432</p>
        <p>2026 TODOS LOS DERECHOS RESERVADOS</p>
        <p>AUTORES: LUZ MERY JULIO - MONICA MEDINA</p>
      </footer>

    </div>
  );
}

export default Login;