import React, { useState } from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';

function RecuperarClave() {

  const [usuario, setUsuario] = useState("");
  const [mostrarCambio, setMostrarCambio] = useState(false);
  const [claveNueva, setClaveNueva] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");

  const verificarUsuario = () => {

    if(usuario === ""){
      alert("Ingrese su usuario o cédula");
      return;
    }

    setMostrarCambio(true);

  };

  const cambiarClave = async () => {

    if(claveNueva === "" || confirmarClave === ""){
      alert("Debe completar las contraseñas");
      return;
    }

    if(claveNueva !== confirmarClave){
      alert("Las contraseñas no coinciden");
      return;
    }

    try{

     const response = await fetch(
  "http://localhost/factufast-api/usuarios/reset_password.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  usuario: usuario,
  clave: claveNueva
})
  }
);
      const data = await response.json();

      if(data.success){

        alert("Contraseña actualizada correctamente");

        window.location.href="/login";

      }else{

        alert("No se pudo cambiar la contraseña");

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

        <div style={{
          background:"white",
          padding:"40px",
          borderRadius:"10px",
          width:"350px",
          boxShadow:"0 0 10px rgba(0,0,0,0.2)"
        }}>

          <h2 style={{textAlign:"center"}}>Recuperar Contraseña</h2>

          <p>Ingrese su usuario o cédula</p>

          <input
            type="text"
            placeholder="Usuario o cédula"
            value={usuario}
            onChange={(e)=>setUsuario(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"15px"
            }}
          />

          <button
            onClick={verificarUsuario}
            style={{
              width:"100%",
              padding:"10px",
              background:"#c5b37a",
              border:"none",
              cursor:"pointer"
            }}
          >
            Continuar
          </button>

          {mostrarCambio && (

            <div style={{marginTop:"20px"}}>

              <input
                type="password"
                placeholder="Nueva contraseña"
                value={claveNueva}
                onChange={(e)=>setClaveNueva(e.target.value)}
                style={{
                  width:"100%",
                  padding:"10px",
                  marginBottom:"10px"
                }}
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarClave}
                onChange={(e)=>setConfirmarClave(e.target.value)}
                style={{
                  width:"100%",
                  padding:"10px",
                  marginBottom:"10px"
                }}
              />

              <button
                onClick={cambiarClave}
                style={{
                  width:"100%",
                  padding:"10px",
                  background:"#c5b37a",
                  border:"none",
                  cursor:"pointer"
                }}
              >
                Guardar nueva contraseña
              </button>

            </div>

          )}

        </div>

      </div>

      <Footer />

    </div>

  );

}

export default RecuperarClave;