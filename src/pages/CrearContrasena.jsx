import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";


function CrearContrasena() {


const navigate = useNavigate();


const [usuario, setUsuario] = useState("");
const [clave, setClave] = useState("");
const [confirmarClave, setConfirmarClave] = useState("");
const [verClave, setVerClave] = useState(false);
const [verConfirmar, setVerConfirmar] = useState(false);

const [mensaje, setMensaje] = useState("");
const [tipoMensaje, setTipoMensaje] = useState("");

const [cargando, setCargando] = useState(false);



// ESTILOS

const labelStyle = {

  color: "#fff",
  fontSize: "14px",
  marginBottom: "6px",
  textAlign: "left",
  display: "block"

};



const inputStyle = {

  width: "100%",
  padding: "11px",
  background: "#3b3b3b",
  border: "1px solid #555",
  borderRadius: "5px",
  color: "#fff",
  marginBottom: "14px",
  boxSizing: "border-box",
  outline: "none"

};

const inputContainerStyle = {
  position: "relative",
  width: "100%",
  marginBottom: "14px"
};

const ojoBtnStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#C9BD86",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold"
};


const btnStyle = {

  width: "100%",
  padding: "12px",
  background: "#C9BD86",
  color: "#1a1a1a",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px"

};



const btnOutlineStyle = {

  width: "100%",
  padding: "10px",
  background: "transparent",
  color: "#C9BD86",
  border: "1px solid #C9BD86",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "14px",
  marginTop: "16px"

};




// CREAR CONTRASEÑA


const crearContrasena = async () => {


  if(!usuario || !clave || !confirmarClave){

    setMensaje("Complete todos los campos");
    setTipoMensaje("error");
    return;

  }



  if(clave !== confirmarClave){

    setMensaje("Las contraseñas no coinciden");
    setTipoMensaje("error");
    return;

  }



  setCargando(true);



  try {


    const response = await fetch(
      "http://localhost/factufast-api/usuarios/crear_contrasena.php",
      {
        method: "POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({

          cedula_usuario: usuario,

          contrasena: clave

        })

      }
    );




    const data = await response.json();



    if(data.success){


      setMensaje(data.mensaje);

      setTipoMensaje("success");



      setTimeout(()=>{

        navigate("/login");

      },2000);



    }else{


      setMensaje(data.mensaje);

      setTipoMensaje("error");


    }



  } catch(error){


    console.log("ERROR FETCH:", error);


    setMensaje("ERROR: " + error.message);


  }



  setCargando(false);


};






return (


<div

style={{

minHeight:"100vh",

background:"#1a1a1a",

display:"flex",

flexDirection:"column"

}}

>


<Header />



<div

style={{

flex:1,

display:"flex",

justifyContent:"center",

alignItems:"center",

fontFamily:"Arial, Helvetica, sans-serif",

padding:"35px 20px",

boxSizing:"border-box"

}}

>



<div

style={{

background:"#2b2b2b",

border:"1px solid #8A7700",

borderRadius:"10px",

padding:"40px",

width:"100%",

maxWidth:"400px",

boxShadow:"0 8px 30px rgba(0,0,0,0.5)"

}}

>



<h2

style={{

color:"#C9BD86",

fontSize:"26px",

textAlign:"center",

margin:"0 0 8px"

}}

>

Crear Contraseña Inicial

</h2>




<p

style={{

color:"#aaa",

fontSize:"13px",

textAlign:"center",

marginTop:"4px",

marginBottom:"24px"

}}

>

Si eres un usuario nuevo, registra tu contraseña para acceder por primera vez al sistema.

</p>





{mensaje && (


<p

style={{


color:


tipoMensaje === "success"


? "#8ee59b"


: "#ff6b6b",


textAlign:"center",


fontSize:"13px",


marginBottom:"14px"


}}


>


{mensaje}


</p>


)}






<label style={labelStyle}>

Cédula registrada

</label>


<input

type="text"

placeholder="Ingrese su cédula"

value={usuario}

onChange={(e)=>setUsuario(e.target.value)}

style={inputStyle}

/>






<label style={labelStyle}>

Crear contraseña

</label>

<div style={inputContainerStyle}>
  <input
    type={verClave ? "text" : "password"}
    placeholder="Ingrese la contraseña"
    value={clave}
    onChange={(e)=>setClave(e.target.value)}
    style={{ ...inputStyle, paddingRight: "75px" }}
  />
  <button
    type="button"
    onClick={() => setVerClave(!verClave)}
    style={ojoBtnStyle}
  >
    {verClave ? "Ocultar" : "Mostrar"}
  </button>
</div>

<label style={labelStyle}>

Confirmar contraseña

</label>

<div style={inputContainerStyle}>
  <input
    type={verConfirmar ? "text" : "password"}
    placeholder="Repita la contraseña"
    value={confirmarClave}
    onChange={(e)=>setConfirmarClave(e.target.value)}
    style={{ ...inputStyle, paddingRight: "75px" }}
  />
  <button
    type="button"
    onClick={() => setVerConfirmar(!verConfirmar)}
    style={ojoBtnStyle}
  >
    {verConfirmar ? "Ocultar" : "Mostrar"}
  </button>
</div>






<button

onClick={crearContrasena}

disabled={cargando}

style={{

...btnStyle,

opacity:cargando ? 0.7 : 1,

cursor:cargando ? "not-allowed":"pointer"

}}

>


{

cargando

?

"Creando..."

:

"Crear contraseña inicial"

}


</button>






<button

type="button"

onClick={()=>navigate("/login")}

style={btnOutlineStyle}

>


Volver al login


</button>





</div>


</div>





<Footer />


</div>


);


}



export default CrearContrasena;