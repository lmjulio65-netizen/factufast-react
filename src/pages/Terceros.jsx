import React, {
  useEffect,
  useState,
} from 'react';

const C = {
  dorado:"#8B7A00", doradoClaro:"#C4B456", crema:"#D4C98A",
  cremaSuave:"#EDE8C8", blanco:"#ffffff", texto:"#3a3300", rojo:"#b71c1c"
};
const thStyle = { background:C.dorado, color:C.blanco, padding:"10px", textAlign:"left" };
const tdStyle = { padding:"8px 10px", borderBottom:`1px solid ${C.crema}` };
const inpStyle = {
  width:"100%", padding:"8px", marginBottom:"12px",
  borderRadius:"6px", border:`1px solid ${C.doradoClaro}`,
  fontSize:"14px", boxSizing:"border-box"
};
const btnStyle = {
  background:C.dorado, color:C.blanco, padding:"9px 18px",
  border:"none", borderRadius:"6px", cursor:"pointer",
  fontSize:"14px", marginRight:"8px"
};

function Terceros(){

const [terceros,setTerceros] = useState([]);
const [nombre,setNombre]     = useState("");
const [telefono,setTelefono] = useState("");
const [tipo,setTipo]         = useState("empleado");

useEffect(()=>{ obtenerTerceros(); },[]);

const obtenerTerceros = () => {
  fetch("http://localhost/factufast-api/terceros/listar.php")
  .then(res=>res.json()).then(data=>setTerceros(data));
};

const guardar = (e) => {
  e.preventDefault();
  if(!nombre){ alert("Ingrese el nombre"); return; }
  fetch("http://localhost/factufast-api/terceros/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ nombre, telefono, tipo })
  }).then(res=>res.json()).then(()=>{
    setNombre(""); setTelefono(""); setTipo("empleado");
    obtenerTerceros();
  });
};

const eliminar = (id) => {
  if(!window.confirm("¿Eliminar tercero?")) return;
  fetch(`http://localhost/factufast-api/terceros/eliminar.php?id=${id}`)
  .then(res=>res.json()).then(()=>obtenerTerceros());
};

return(
<div className="gerente-container">

  <h2 style={{ color:C.dorado }}>👤 Terceros</h2>
  <p style={{ color:"#666" }}>
    Registra empleados, proveedores ocasionales o cualquier persona
    a quien se le realicen pagos.
  </p>

  <div style={{ background:C.cremaSuave, padding:"20px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <form onSubmit={guardar}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 20px" }}>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Nombre</label>
          <input style={inpStyle} placeholder="Ej: Anderson García"
            value={nombre} onChange={(e)=>setNombre(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Teléfono</label>
          <input style={inpStyle} placeholder="Ej: 3001234567"
            value={telefono} onChange={(e)=>setTelefono(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Tipo</label>
          <select style={inpStyle} value={tipo}
            onChange={(e)=>setTipo(e.target.value)}>
            <option value="empleado">Empleado</option>
            <option value="proveedor">Proveedor ocasional</option>
            <option value="transportista">Transportista</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <button type="submit" style={btnStyle}>➕ Registrar Tercero</button>
    </form>
  </div>

  <table style={{ width:"100%", borderCollapse:"collapse" }}>
    <thead>
      <tr>
        <th style={thStyle}>Nombre</th>
        <th style={thStyle}>Teléfono</th>
        <th style={thStyle}>Tipo</th>
        <th style={thStyle}>Acción</th>
      </tr>
    </thead>
    <tbody>
      {terceros.map((t,i)=>(
        <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
          <td style={tdStyle}>{t.nombre}</td>
          <td style={tdStyle}>{t.telefono || "—"}</td>
          <td style={tdStyle}>{t.tipo}</td>
          <td style={tdStyle}>
            <button onClick={()=>eliminar(t.id_tercero)}
              style={{ ...btnStyle, background:C.rojo,
                       padding:"5px 10px", fontSize:"12px" }}>
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

export default Terceros;