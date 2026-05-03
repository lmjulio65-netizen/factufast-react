import './Register.css';

import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import logo from '../assets/logo.png';

const PAISES_CIUDADES = {
  "Colombia": ["Barranquilla", "Bogotá", "Bucaramanga", "Cali", "Cartagena",
    "Cúcuta", "Ibagué", "Leticia", "Maicao", "Manizales", "Medellín",
    "Montería", "Neiva", "Pasto", "Pereira", "Popayán", "Riohacha",
    "Santa Marta", "Sincelejo", "Tunja", "Valledupar", "Villavicencio", "Otra"],
  "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto",
    "Maturín", "Ciudad Guayana", "Otra"],
  "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Ambato", "Otra"],
  "Perú": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Otra"],
  "México": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Otra"],
  "España": ["Madrid", "Barcelona", "Valencia", "Sevilla", "Otra"],
  "Estados Unidos": ["Miami", "Nueva York", "Los Ángeles", "Chicago", "Otra"],
  "Otro país": ["Otra"]
};

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (telefono.replace(/\D/g, "").length < 7) {
      return setError("El teléfono debe tener mínimo 7 dígitos");
    }
    if (contrasena !== confirmar) {
      return setError("Las contraseñas no coinciden");
    }
    if (!pais || !ciudad) {
      return setError("Selecciona país y ciudad");
    }
    if (contrasena.length < 4) {
      return setError("La contraseña debe tener mínimo 4 caracteres");
    }

    const direccionCompleta = `${direccion}, ${ciudad}, ${pais}`;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo", correo);
    formData.append("direccion", direccionCompleta);
    formData.append("telefono", telefono);
    formData.append("cedula", cedula);
    formData.append("contrasena", contrasena);

    try {
      const response = await fetch("http://localhost/factufast-api/registro.php", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        alert("✅ Usuario registrado correctamente");
        navigate("/login");
      } else {
        setError(data.mensaje);
      }
    } catch {
      setError("Error conectando con el servidor");
    }
  };

  return (
    <div className="register-container">

      <header className="register-header">
        <img src={logo} alt="logo" />
        <h1>Registro de Usuario</h1>
        <p>Completa todos los campos para crear tu cuenta</p>
      </header>

      <div className="register-card">
        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center",
            fontSize: "13px", marginBottom: "10px" }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Nombre completo *</label>
          <input type="text" value={nombre}
            placeholder="Ej: Lxxx Jxxxx"
            onChange={e => setNombre(e.target.value)} required />

          <label>Cédula / Documento *</label>
          <input type="text" value={cedula}
            placeholder="Número de documento"
            onChange={e => setCedula(e.target.value)} required />

          <label>Correo *</label>
          <input type="email" value={correo}
            placeholder="Ej: correo@gmail.com"
            onChange={e => setCorreo(e.target.value)} required />

          <label>Teléfono *</label>
          <input type="text" value={telefono}
            placeholder="Ej: 302XXXXXX"
            onChange={e => setTelefono(e.target.value)} required />

          <label>País *</label>
          <select className="register-select" value={pais}
            onChange={e => { setPais(e.target.value); setCiudad(""); }} required>
            <option value="">— Selecciona país —</option>
            {Object.keys(PAISES_CIUDADES).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <label>Ciudad *</label>
          <select className="register-select" value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            required disabled={!pais}>
            <option value="">— Selecciona ciudad —</option>
            {pais && PAISES_CIUDADES[pais].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label>Dirección *</label>
          <input type="text" value={direccion}
            placeholder="Ej: Calle 22A #15-30, Barrio Centro"
            onChange={e => setDireccion(e.target.value)} required />

          <label>Contraseña *</label>
          <input type="password" value={contrasena}
            placeholder="Mínimo 4 caracteres"
            onChange={e => setContrasena(e.target.value)} required />

          <label>Confirmar contraseña *</label>
          <input type="password" value={confirmar}
            placeholder="Repite la contraseña"
            onChange={e => setConfirmar(e.target.value)} required />

          <button type="submit">Registrarse</button>

          <p className="login-link">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Link to="/" style={{ color: "#666", fontSize: "12px",
              textDecoration: "none" }}>← Salir</Link>
          </div>

        </form>
      </div>

      <footer className="register-footer">
        <p>Contacto: 3024698432</p>
        <p>2026 TODOS LOS DERECHOS RESERVADOS</p>
        <p>AUTORES: LUZ MERY JULIO - MONICA MEDINA</p>
      </footer>

    </div>
  );
}

export default Register;