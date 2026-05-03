import './Gerente.css';

import React, {
  useEffect,
  useState,
} from 'react';

function Configuracion() {

  const [usuarios, setUsuarios] = useState([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [rol, setRol] = useState("");

  const [editando, setEditando] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

  // USUARIO ACTIVO
  const usuarioActivo = localStorage.getItem("usuario");
  const rolActivo = localStorage.getItem("rol");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {

    fetch("http://localhost/factufast-api/usuarios/listar.php")
      .then(res => res.json())
      .then(data => setUsuarios(data));

  };

  // REGISTRAR USUARIO
  const registrarUsuario = (e) => {

    e.preventDefault();

    fetch("http://localhost/factufast-api/usuarios/guardar.php", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        nombre_usuario: nombre,
        correo_usuario: correo,
        telefono_usuario: telefono,
        cedula_usuario: cedula,
        id_rol: rol
      })

    })
    .then(res => res.json())
    .then(() => {

      obtenerUsuarios();
      limpiarFormulario();

    });

  };

  // ELIMINAR USUARIO
  const eliminarUsuario = (id) => {

    if (!window.confirm("¿Eliminar usuario?")) return;

    fetch(`http://localhost/factufast-api/usuarios/eliminar.php?id=${id}`)
    .then(res => res.json())
    .then(() => obtenerUsuarios());

  };

  // RESET PASSWORD
  const resetPassword = (id) => {

    if(!window.confirm("¿Restablecer contraseña del usuario?")) return;

    fetch("http://localhost/factufast-api/usuarios/reset_password.php?id="+id)
    .then(res => res.json())
    .then(() => {

      alert("La contraseña del usuario fue restablecida.\n\nNueva contraseña temporal: 123456\n\nEl usuario debe cambiarla al ingresar.");

    })
    .catch(error => console.log(error));

  };

  // EDITAR USUARIO
  const editarUsuario = (user) => {

    setEditando(true);

    setIdUsuario(user.id_usuario);
    setNombre(user.nombre_usuario);
    setCorreo(user.correo_usuario);
    setTelefono(user.telefono_usuario);
    setCedula(user.cedula_usuario);
    setRol(user.id_rol);

  };

  // ACTUALIZAR USUARIO
  const actualizarUsuario = (e) => {

    e.preventDefault();

    fetch("http://localhost/factufast-api/usuarios/actualizar.php", {

      method: "POST",

      headers:{
        "Content-Type":"application/json"
      },

      body: JSON.stringify({

        id_usuario: idUsuario,
        nombre_usuario: nombre,
        correo_usuario: correo,
        telefono_usuario: telefono,
        cedula_usuario: cedula,
        id_rol: rol

      })

    })
    .then(res => res.json())
    .then(() => {

      obtenerUsuarios();
      limpiarFormulario();

    });

  };

  const limpiarFormulario = () => {

    setNombre("");
    setCorreo("");
    setTelefono("");
    setCedula("");
    setRol("");

    setEditando(false);
    setIdUsuario(null);

  };

  // CERRAR SESION
  const cerrarSesion = () => {

    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    window.location.href="/login";

  };

  return (

    <div className="gerente-container">

      <h2>Configuración de Usuarios</h2>

      {/* USUARIO ACTIVO */}

      <div style={{marginBottom:"20px"}}>

      </div>


      {/* FORMULARIO */}

      <form onSubmit={editando ? actualizarUsuario : registrarUsuario}>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
        />

        <input
          placeholder="Correo"
          value={correo}
          onChange={(e)=>setCorreo(e.target.value)}
        />

        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e)=>setTelefono(e.target.value)}
        />

        <input
          placeholder="Cédula"
          value={cedula}
          onChange={(e)=>setCedula(e.target.value)}
        />

        <input
          placeholder="Rol (1=Gerente, 2=Admin, 3=Empleado)"
          value={rol}
          onChange={(e)=>setRol(e.target.value)}
        />

        <button type="submit">

          {editando ? "Actualizar Usuario" : "Registrar Usuario"}

        </button>

      </form>


      {/* TABLA */}

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Cédula</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {usuarios.map((user)=>(

            <tr key={user.id_usuario}>

              <td>{user.id_usuario}</td>
              <td>{user.nombre_usuario}</td>
              <td>{user.correo_usuario}</td>
              <td>{user.telefono_usuario}</td>
              <td>{user.cedula_usuario}</td>

              <td>
                {user.id_rol == 1 ? "Gerente" :
                 user.id_rol == 2 ? "Administrador" :
                 "Empleado"}
              </td>

              <td>

                <button onClick={()=>editarUsuario(user)}>
                  Editar
                </button>

                <button onClick={()=>eliminarUsuario(user.id_usuario)}>
                  Eliminar
                </button>

                <button onClick={()=>resetPassword(user.id_usuario)}>
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