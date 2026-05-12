import './Gerente.css';

import React, {
  useEffect,
  useState,
} from 'react';

const C = {
  dorado:     "#8B7A00",
  doradoClaro:"#C4B456",
  crema:      "#D4C98A",
  cremaSuave: "#EDE8C8",
  blanco:     "#ffffff",
  texto:      "#3a3300",
  rojo:       "#b71c1c",
};

const thStyle = {
  background: C.dorado, color: C.blanco,
  padding: "10px", textAlign: "left"
};
const tdStyle = { padding: "8px 10px", borderBottom: `1px solid ${C.crema}` };
const inpStyle = {
  width: "100%", padding: "8px", marginBottom: "12px",
  borderRadius: "6px", border: `1px solid ${C.doradoClaro}`,
  fontSize: "14px", boxSizing: "border-box"
};
const btnStyle = {
  background: C.dorado, color: C.blanco,
  padding: "9px 18px", border: "none",
  borderRadius: "6px", cursor: "pointer",
  fontSize: "14px", marginRight: "8px"
};

function Configuracion() {

  // ── EMPRESA ──────────────────────────────
  const [empresa, setEmpresa] = useState({
    nombre_empresa: "", slogan: "", nit: "",
    telefono: "", direccion: "", ciudad: "", correo: ""
  });
  const [guardadoEmpresa, setGuardadoEmpresa] = useState(false);

  // ── USUARIOS ─────────────────────────────
  const [usuarios, setUsuarios]   = useState([]);
  const [nombre, setNombre]       = useState("");
  const [correo, setCorreo]       = useState("");
  const [telefono, setTelefono]   = useState("");
  const [cedula, setCedula]       = useState("");
  const [rol, setRol]             = useState("");
  const [editando, setEditando]   = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(()=>{
    fetch("http://localhost/factufast-api/configuracion/obtener.php")
    .then(res=>res.json()).then(data=>setEmpresa(data));
    obtenerUsuarios();
  },[]);

  // ── EMPRESA HANDLERS ─────────────────────
  const handleEmpresa = (e) =>
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });

  const guardarEmpresa = async () => {
    await fetch("http://localhost/factufast-api/configuracion/guardar.php",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empresa)
    });
    setGuardadoEmpresa(true);
    setTimeout(()=>setGuardadoEmpresa(false), 3000);
  };

  // ── USUARIOS HANDLERS ────────────────────
  const obtenerUsuarios = () => {
    fetch("http://localhost/factufast-api/usuarios/listar.php")
    .then(res=>res.json()).then(data=>setUsuarios(data));
  };

  const registrarUsuario = (e) => {
    e.preventDefault();
    fetch("http://localhost/factufast-api/usuarios/guardar.php",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_usuario: nombre, correo_usuario: correo,
        telefono_usuario: telefono, cedula_usuario: cedula, id_rol: rol
      })
    }).then(res=>res.json()).then(()=>{ obtenerUsuarios(); limpiarFormulario(); });
  };

  const eliminarUsuario = (id) => {
    if(!window.confirm("¿Eliminar usuario?")) return;
    fetch(`http://localhost/factufast-api/usuarios/eliminar.php?id=${id}`)
    .then(res=>res.json()).then(()=>obtenerUsuarios());
  };

  const resetPassword = (id) => {
    if(!window.confirm("¿Restablecer contraseña?")) return;
    fetch("http://localhost/factufast-api/usuarios/reset_password.php?id="+id)
    .then(res=>res.json())
    .then(()=>alert("✅ Contraseña restablecida.\nNueva contraseña temporal: 123456"));
  };

  const editarUsuario = (user) => {
    setEditando(true);
    setIdUsuario(user.id_usuario);
    setNombre(user.nombre_usuario);
    setCorreo(user.correo_usuario);
    setTelefono(user.telefono_usuario);
    setCedula(user.cedula_usuario);
    setRol(user.id_rol);
  };

  const actualizarUsuario = (e) => {
    e.preventDefault();
    fetch("http://localhost/factufast-api/usuarios/actualizar.php",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: idUsuario, nombre_usuario: nombre,
        correo_usuario: correo, telefono_usuario: telefono,
        cedula_usuario: cedula, id_rol: rol
      })
    }).then(res=>res.json()).then(()=>{ obtenerUsuarios(); limpiarFormulario(); });
  };

  const limpiarFormulario = () => {
    setNombre(""); setCorreo(""); setTelefono("");
    setCedula(""); setRol(""); setEditando(false); setIdUsuario(null);
  };

  return (
  <div className="gerente-container">

    {/* ══ SECCIÓN EMPRESA ══════════════════════════════ */}
    <h2 style={{ color: C.dorado }}>🏢 Datos de la Empresa</h2>
    <p style={{ color:"#666", marginBottom:"16px" }}>
      Estos datos aparecerán en todas las facturas generadas.
    </p>

    <div style={{
      background: C.cremaSuave, padding:"20px",
      borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
      marginBottom:"30px"
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>Nombre empresa</label>
          <input style={inpStyle} name="nombre_empresa"
            value={empresa.nombre_empresa || ""} onChange={handleEmpresa} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>Slogan</label>
          <input style={inpStyle} name="slogan"
            value={empresa.slogan || ""} onChange={handleEmpresa} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>NIT</label>
          <input style={inpStyle} name="nit"
            value={empresa.nit || ""} onChange={handleEmpresa} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>Teléfono</label>
          <input style={inpStyle} name="telefono"
            value={empresa.telefono || ""} onChange={handleEmpresa} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>Dirección</label>
          <input style={inpStyle} name="direccion"
            value={empresa.direccion || ""} onChange={handleEmpresa} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color: C.texto }}>Ciudad</label>
          <input style={inpStyle} name="ciudad"
            value={empresa.ciudad || ""} onChange={handleEmpresa} />
        </div>

        <div style={{ gridColumn:"1 / -1" }}>
          <label style={{ fontWeight:"bold", color: C.texto }}>Correo</label>
          <input style={inpStyle} name="correo"
            value={empresa.correo || ""} onChange={handleEmpresa} />
        </div>

      </div>

      <button onClick={guardarEmpresa} style={btnStyle}>
        💾 Guardar datos empresa
      </button>

      {guardadoEmpresa && (
        <span style={{ color:"green", marginLeft:"10px" }}>
          ✅ Guardado correctamente
        </span>
      )}
    </div>

    {/* ══ SECCIÓN USUARIOS ═════════════════════════════ */}
    <h2 style={{ color: C.dorado }}>👥 Gestión de Usuarios</h2>

    <div style={{
      background: C.cremaSuave, padding:"20px",
      borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
      marginBottom:"24px"
    }}>
      <form onSubmit={editando ? actualizarUsuario : registrarUsuario}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>

          <div>
            <label style={{ fontWeight:"bold", color: C.texto }}>Nombre</label>
            <input style={inpStyle} placeholder="Nombre"
              value={nombre} onChange={(e)=>setNombre(e.target.value)} />
          </div>

          <div>
            <label style={{ fontWeight:"bold", color: C.texto }}>Correo</label>
            <input style={inpStyle} placeholder="Correo"
              value={correo} onChange={(e)=>setCorreo(e.target.value)} />
          </div>

          <div>
            <label style={{ fontWeight:"bold", color: C.texto }}>Teléfono</label>
            <input style={inpStyle} placeholder="Teléfono"
              value={telefono} onChange={(e)=>setTelefono(e.target.value)} />
          </div>

          <div>
            <label style={{ fontWeight:"bold", color: C.texto }}>Cédula</label>
            <input style={inpStyle} placeholder="Cédula"
              value={cedula} onChange={(e)=>setCedula(e.target.value)} />
          </div>

          <div>
            <label style={{ fontWeight:"bold", color: C.texto }}>Rol</label>
            <select style={inpStyle} value={rol}
              onChange={(e)=>setRol(e.target.value)}>
              <option value="">Seleccione rol</option>
              <option value="1">Gerente 1</option>
              <option value="2">Administrador</option>
              <option value="3">Empleado</option>
            </select>
          </div>

        </div>

        <button type="submit" style={btnStyle}>
          {editando ? "✏ Actualizar Usuario" : "➕ Registrar Usuario"}
        </button>

        {editando && (
          <button type="button" onClick={limpiarFormulario}
            style={{ ...btnStyle, background:"#666" }}>
            Cancelar
          </button>
        )}
      </form>
    </div>

    <table style={{ width:"100%", borderCollapse:"collapse" }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Nombre</th>
          <th style={thStyle}>Correo</th>
          <th style={thStyle}>Teléfono</th>
          <th style={thStyle}>Cédula</th>
          <th style={thStyle}>Rol</th>
          <th style={thStyle}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((user, i)=>(
          <tr key={user.id_usuario}
            style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{user.id_usuario}</td>
            <td style={tdStyle}>{user.nombre_usuario}</td>
            <td style={tdStyle}>{user.correo_usuario}</td>
            <td style={tdStyle}>{user.telefono_usuario}</td>
            <td style={tdStyle}>{user.cedula_usuario}</td>
            <td style={tdStyle}>
              {user.id_rol == 1 ? "Gerente" :
               user.id_rol == 2 ? "Administrador" : "Empleado"}
            </td>
            <td style={tdStyle}>
              <button onClick={()=>editarUsuario(user)}
                style={{ ...btnStyle, padding:"5px 10px", fontSize:"12px" }}>
                Editar
              </button>
              <button onClick={()=>eliminarUsuario(user.id_usuario)}
                style={{ ...btnStyle, background: C.rojo,
                         padding:"5px 10px", fontSize:"12px" }}>
                Eliminar
              </button>
              <button onClick={()=>resetPassword(user.id_usuario)}
                style={{ ...btnStyle, background:"#555",
                         padding:"5px 10px", fontSize:"12px" }}>
                Reset clave
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
  );
}

export default Configuracion;