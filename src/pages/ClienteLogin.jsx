import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import logo from '../assets/logo.png';

function ClienteLogin() {
  const navigate = useNavigate();
  const [nit, setNit] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [modo, setModo] = useState("login"); // "login" | "verificar" | "crear"
  const [error, setError] = useState("");

  // VERIFICAR IDENTIDAD — NIT + correo
  const handleVerificar = async () => {
    if (!nit || !correo) return setError("Ingresa tu NIT y correo");

    const res = await fetch("http://localhost/factufast-api/clientes_portal/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nit, correo, solo_verificar: true })
    });
    const data = await res.json();

    if (data.success && data.sin_password) {
      setError("");
      setModo("crear");
    } else if (data.success && !data.sin_password) {
      setError("Este NIT ya tiene contraseña, inicia sesión normalmente.");
      setModo("login");
    } else {
      setError(data.mensaje);
    }
  };

  // CREAR CONTRASEÑA
  const handleCrearPassword = async () => {
    if (!passwordNueva || passwordNueva.length < 4)
      return setError("Mínimo 4 caracteres");
    if (passwordNueva !== confirmar)
      return setError("Las contraseñas no coinciden");

    const res = await fetch("http://localhost/factufast-api/clientes_portal/registro_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nit, correo, password: passwordNueva })
    });
    const data = await res.json();

    if (data.success) {
      setError("");
      setModo("login");
      alert("✅ Contraseña creada. Ahora inicia sesión.");
    } else {
      setError(data.mensaje);
    }
  };

  // LOGIN NORMAL
  const handleLogin = async () => {
    if (!nit || !password) return setError("Ingresa tu NIT y contraseña");

    const res = await fetch("http://localhost/factufast-api/clientes_portal/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nit, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("cliente_nit", data.nit);
      localStorage.setItem("cliente_nombre", data.nombre);
      localStorage.setItem("cliente_id", data.id_cliente);
      navigate("/cliente/facturas");
    } else {
      setError(data.mensaje);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        background: "#2b2b2b",
        border: "1px solid #8A7700",
        borderRadius: "10px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
      }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src={logo} alt="logo" style={{ width: "50px", marginBottom: "8px" }} />
          <h1 style={{ color: "#C9BD86", fontSize: "28px", letterSpacing: "2px", margin: 0 }}>
            FACTUFAST
          </h1>
          <p style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>
            Portal del cliente
          </p>
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center",
            fontSize: "13px", marginBottom: "14px" }}>
            {error}
          </p>
        )}

        {/* ===== LOGIN NORMAL ===== */}
        {modo === "login" && (
          <>
            <label style={labelStyle}>NIT</label>
            <input style={inputStyle} type="text" value={nit}
              onChange={e => setNit(e.target.value)}
              placeholder="Tu número de NIT" />

            <label style={labelStyle}>Contraseña</label>
            <input style={inputStyle} type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña" />

            <button onClick={handleLogin} style={btnStyle}>
              Ingresar
            </button>

            <p style={{ textAlign: "center", marginTop: "16px",
              fontSize: "13px", color: "#aaa" }}>
              ¿Primera vez?{" "}
              <span onClick={() => { setModo("verificar"); setError(""); }}
                style={{ color: "#C9BD86", cursor: "pointer", textDecoration: "underline" }}>
                Crea tu contraseña aquí
              </span>
            </p>
          </>
        )}

        {/* ===== VERIFICAR IDENTIDAD ===== */}
        {modo === "verificar" && (
          <>
            <p style={{ color: "#C9BD86", fontSize: "13px",
              marginBottom: "14px", textAlign: "center" }}>
              Ingresa tu NIT y el correo con el que estás registrado
            </p>

            <label style={labelStyle}>NIT</label>
            <input style={inputStyle} type="text" value={nit}
              onChange={e => setNit(e.target.value)}
              placeholder="Tu número de NIT" />

            <label style={labelStyle}>Correo registrado</label>
            <input style={inputStyle} type="email" value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="Tu correo" />

            <button onClick={handleVerificar} style={btnStyle}>
              Verificar identidad
            </button>

            <p style={{ textAlign: "center", marginTop: "16px",
              fontSize: "13px", color: "#aaa" }}>
              <span onClick={() => { setModo("login"); setError(""); }}
                style={{ color: "#C9BD86", cursor: "pointer", textDecoration: "underline" }}>
                ← Volver al login
              </span>
            </p>
          </>
        )}

        {/* ===== CREAR CONTRASEÑA ===== */}
        {modo === "crear" && (
          <>
            <p style={{ color: "#4caf50", fontSize: "13px",
              marginBottom: "14px", textAlign: "center" }}>
              ✅ Identidad verificada — crea tu contraseña
            </p>

            <label style={labelStyle}>Nueva contraseña</label>
            <input style={inputStyle} type="password" value={passwordNueva}
              onChange={e => setPasswordNueva(e.target.value)}
              placeholder="Mínimo 4 caracteres" />

            <label style={labelStyle}>Confirmar contraseña</label>
            <input style={inputStyle} type="password" value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="Repite la contraseña" />

            <button onClick={handleCrearPassword} style={btnStyle}>
              Crear contraseña
            </button>

            <p style={{ textAlign: "center", marginTop: "16px",
              fontSize: "13px", color: "#aaa" }}>
              <span onClick={() => { setModo("login"); setError(""); }}
                style={{ color: "#C9BD86", cursor: "pointer", textDecoration: "underline" }}>
                ← Volver al login
              </span>
            </p>
          </>
        )}

        {/* VOLVER AL INICIO */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link to="/" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#C9BD86",
  fontSize: "13px",
  marginBottom: "5px",
  marginTop: "14px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #8A7700",
  background: "#1a1a1a",
  color: "#f1eaea",
  fontSize: "14px",
  boxSizing: "border-box"
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  backgroundColor: "#8A7700",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "15px",
  cursor: "pointer"
};

export default ClienteLogin;