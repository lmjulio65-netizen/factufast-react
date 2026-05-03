import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

function Clientes(){

  const navigate = useNavigate();

  const [clientes,setClientes] = useState([]);

  const [nombre,setNombre] = useState("");
  const [documento,setDocumento] = useState("");
  const [telefono,setTelefono] = useState("");
  const [correo,setCorreo] = useState("");
  const [direccion,setDireccion] = useState("");

  const [idEditar,setIdEditar] = useState(null);

  useEffect(()=>{
    listarClientes();
  },[]);


  function listarClientes(){

    fetch("http://localhost/factufast-api/clientes/listar.php")
    .then(res=>res.json())
    .then(data=>{
      setClientes(data);
    });

  }


  function registrarCliente(e){

    e.preventDefault();

    fetch("http://localhost/factufast-api/clientes/guardar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        nit_cliente:documento,
        nombre_cliente:nombre,
        direccion_cliente:direccion,
        correo_cliente:correo,
        telefono_cliente:telefono

      })

    })

    .then(res=>res.json())
    .then(data=>{

      alert(data.mensaje);

      listarClientes();

      limpiar();

    });

  }


  function eliminarCliente(id){

    if(!window.confirm("¿Eliminar cliente?")) return;

    fetch("http://localhost/factufast-api/clientes/eliminar.php",{

      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        id_cliente:id
      })

    })

    .then(res=>res.json())
    .then(data=>{

      alert(data.mensaje);

      listarClientes();

    });

  }


  function editarCliente(cliente){

    setIdEditar(cliente.id_cliente);
    setNombre(cliente.nombre_cliente);
    setDocumento(cliente.nit_cliente);
    setTelefono(cliente.telefono_cliente);
    setCorreo(cliente.correo_cliente);
    setDireccion(cliente.direccion_cliente);

  }


  function actualizarCliente(e){

    e.preventDefault();

    fetch("http://localhost/factufast-api/clientes/editar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        id_cliente:idEditar,
        nit_cliente:documento,
        nombre_cliente:nombre,
        direccion_cliente:direccion,
        correo_cliente:correo,
        telefono_cliente:telefono

      })

    })

    .then(res=>res.json())
    .then(data=>{

      alert(data.mensaje);

      listarClientes();

      limpiar();

      setIdEditar(null);

    });

  }


  function limpiar(){

    setNombre("");
    setDocumento("");
    setTelefono("");
    setCorreo("");
    setDireccion("");

  }


  return(

    <div className="container">

      {/* 🔥 BOTÓN VOLVER 
      <button onClick={() => navigate("/gerente")}>
        ⬅ Volver al Panel
      </button>*/}

      <h2>Clientes</h2>

      <form onSubmit={idEditar ? actualizarCliente : registrarCliente}>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Documento"
          value={documento}
          onChange={(e)=>setDocumento(e.target.value)}
        />

        <input
          type="text"
          placeholder="Telefono"
          value={telefono}
          onChange={(e)=>setTelefono(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e)=>setCorreo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Direccion"
          value={direccion}
          onChange={(e)=>setDireccion(e.target.value)}
        />

        <button type="submit">
          {idEditar ? "Actualizar Cliente" : "Registrar Cliente"}
        </button>

      </form>

      <hr/>

      <h3>Lista de Clientes</h3>

      <table border="1">

        <thead>

          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>NIT/CEDULA</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Direccion</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {clientes.map((cliente)=>(

            <tr key={cliente.id_cliente}>

              <td>{cliente.id_cliente}</td>
              <td>{cliente.nombre_cliente}</td>
              <td>{cliente.nit_cliente}</td>
              <td>{cliente.telefono_cliente}</td>
              <td>{cliente.correo_cliente}</td>
              <td>{cliente.direccion_cliente}</td>

              <td>
                <button onClick={()=>editarCliente(cliente)}>Editar</button>
                <button onClick={()=>eliminarCliente(cliente.id_cliente)}>
                  Eliminar
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Clientes;