import React, { useState } from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';

function RecuperarUsuario() {

  const [correo, setCorreo] = useState("");

  const buscarUsuario = async () => {

    if(correo === ""){
      alert("Ingrese su correo");
      return;
    }

    try{

      const response = await fetch(
        "http://localhost/factufast-api/usuarios/recuperar_usuario.php",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            correo: correo
          })
        }
      );

      const data = await response.json();

      if(data.success){

        alert(
"Usuario encontrado\n\n"+
"Nombre: "+data.nombre+"\n"+
"Usuario: "+data.usuario
);

/* llevar al login */
window.location.href="/login";

      }else{

        alert(data.mensaje);

      }

    }catch(error){

      console.error(error);
      alert("Error conectando con el servidor");

    }

  };

  return (

    <div>

      <Header />

      <div style={{
        minHeight:"70vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#f2f2f2"
      }}>
{/* el contededor de correo */}
        <div style={{
          background:"white",
          padding:"40px",
          borderRadius:"10px",
          width:"350px",
          boxShadow:"0 0 10px rgba(0,0,0,0.2)"
        }}>

          <h2 style={{textAlign:"center"}}>Recuperar Usuario</h2>

          <p>Ingrese su correo para recuperar su usuario</p>

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e)=>setCorreo(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"15px"
            }}
          />

          <button
            onClick={buscarUsuario}
            style={{
              width:"100%",
              padding:"10px",
              background:"#c5b37a",
              border:"none",
              cursor:"pointer"
            }}
          >
            Buscar Usuario
          </button>

        </div>

      </div>

      <Footer />

    </div>

  );

}

export default RecuperarUsuario;