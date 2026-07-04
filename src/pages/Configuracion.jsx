import './Configuracion.css';

import React, { useEffect, useMemo, useState } from 'react';

function Configuracion() {
  const [usuarios, setUsuarios] = useState([]);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [rol, setRol] = useState('');

  const [editando, setEditando] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {
    setCargando(true);

    fetch('http://localhost/factufast-api/usuarios/listar.php')
      .then((res) => res.json())
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => alert('Error cargando usuarios'))
      .finally(() => setCargando(false));
  };

  const nombreRol = (idRol) => {
    if (String(idRol) === '1') return 'Gerente';
    if (String(idRol) === '2') return 'Administrador';
    return 'Empleado';
  };

  const validarFormulario = () => {
    if (!nombre || !correo || !telefono || !cedula || !direccion || !rol) {
      alert('Complete todos los campos');
      return false;
    }

    if (!/^[0-9]+$/.test(telefono)) {
      alert('El telefono solo debe contener numeros');
      return false;
    }

    if (!/^[0-9]+$/.test(cedula)) {
      alert('La cedula solo debe contener numeros');
      return false;
    }

    if (!correo.includes('@')) {
      alert('Ingrese un correo valido');
      return false;
    }

    // Validar que la cédula no exista en otro usuario
    const cedulaExistente = usuarios.find(u => 
      u.cedula_usuario === cedula.trim() && 
      u.id_usuario !== idUsuario // Permitir la misma cédula si se está editando el mismo usuario
    );
    if(cedulaExistente) {
      alert('Este número de cédula ya existe en otro usuario.');
      return false;
    }

    return true;
  };

  const datosUsuario = () => ({
    nombre_usuario: nombre,
    correo_usuario: correo,
    telefono_usuario: telefono,
    cedula_usuario: cedula,
    direccion_usuario: direccion,
    id_rol: rol,
  });

  const registrarUsuario = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    if (!window.confirm('¿Estás seguro que deseas registrar este usuario?')) return;

    fetch('http://localhost/factufast-api/usuarios/guardar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosUsuario()),
    })
      .then((res) => res.json())
      .then(() => {
        obtenerUsuarios();
        limpiarFormulario();
        alert('Usuario registrado');
      })
      .catch(() => alert('Error registrando usuario'));
  };

  const eliminarUsuario = (id) => {
    if (!window.confirm('Eliminar usuario?')) return;

    fetch(`http://localhost/factufast-api/usuarios/eliminar.php?id=${id}`)
      .then((res) => res.json())
      .then(() => obtenerUsuarios())
      .catch(() => alert('Error eliminando usuario'));
  };

  const editarUsuario = (user) => {
    setEditando(true);
    setIdUsuario(user.id_usuario);
    setNombre(user.nombre_usuario || '');
    setCorreo(user.correo_usuario || '');
    setTelefono(user.telefono_usuario || '');
    setCedula(user.cedula_usuario || '');
    setDireccion(user.direccion_usuario || '');
    setRol(String(user.id_rol || ''));
  };

  const actualizarUsuario = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    if (!window.confirm('¿Estás seguro que deseas actualizar este usuario?')) return;

    fetch('http://localhost/factufast-api/usuarios/actualizar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: idUsuario,
        ...datosUsuario(),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        obtenerUsuarios();
        limpiarFormulario();
        alert('Usuario actualizado');
      })
      .catch(() => alert('Error actualizando usuario'));
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setCedula('');
    setDireccion('');
    setRol('');
    setEditando(false);
    setIdUsuario(null);
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return usuarios.filter(
      (user) =>
        String(user.nombre_usuario || '').toLowerCase().includes(texto) ||
        String(user.correo_usuario || '').toLowerCase().includes(texto) ||
        String(user.cedula_usuario || '').toLowerCase().includes(texto) ||
        String(user.direccion_usuario || '').toLowerCase().includes(texto) ||
        nombreRol(user.id_rol).toLowerCase().includes(texto)
    );
  }, [usuarios, busqueda]);

  return (
    <div className="config-page">
      <div className="config-header">
        <div>
          <h2>Configuracion de Usuarios</h2>
          <p>Administra accesos, roles y datos de contacto del equipo.</p>
        </div>
      </div>

      <form
        className="config-form"
        onSubmit={editando ? actualizarUsuario : registrarUsuario}
      >
        <div className="config-form-title">
          <div>
            <h3>{editando ? 'Editar usuario' : 'Registrar usuario'}</h3>
            {editando && <span>Editando ID #{idUsuario}</span>}
          </div>
        </div>

        <div className="config-form-grid">
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            placeholder="Telefono"
            value={telefono}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
          />

          <input
            placeholder="Cedula"
            value={cedula}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
          />

          <input
            placeholder="Direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />

          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Seleccione rol</option>
            <option value="1">Gerente</option>
            <option value="2">Administrador</option>
            <option value="3">Empleado</option>
          </select>
        </div>

        <div className="config-actions">
          <button type="submit" className="btn-primary btn-registrar">
            {editando ? 'Actualizar Usuario' : 'Registrar Usuario'}
          </button>

          {editando && (
            <button type="button" className="btn-secondary" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="config-toolbar">
        <input
          placeholder="Buscar por nombre, correo, cedula, direccion o rol"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="config-table-wrap">
        <table className="config-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Cedula</th>
              <th>Direccion</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="8">Cargando usuarios...</td>
              </tr>
            ) : usuariosFiltrados.length ? (
              usuariosFiltrados.map((user) => (
                <tr key={user.id_usuario}>
                  <td>{user.id_usuario}</td>
                  <td>{user.nombre_usuario}</td>
                  <td>{user.correo_usuario}</td>
                  <td>{user.telefono_usuario}</td>
                  <td>{user.cedula_usuario}</td>
                  <td>{user.direccion_usuario}</td>
                  <td>
                    <span className={`rol-badge rol-${user.id_rol}`}>
                      {nombreRol(user.id_rol)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button type="button" onClick={() => editarUsuario(user)}>
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => eliminarUsuario(user.id_usuario)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay usuarios para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Configuracion;