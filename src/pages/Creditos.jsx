import React, {
  useEffect,
  useState,
} from 'react';

const C = {
  dorado:"#8B7A00", doradoClaro:"#C4B456", crema:"#D4C98A",
  cremaSuave:"#EDE8C8", blanco:"#ffffff", texto:"#3a3300",
  rojo:"#b71c1c", verde:"#2e7d32"
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

function Creditos(){

const [creditos,setCreditos]   = useState([]);
const [clientes,setClientes]   = useState([]);
const [abonos,setAbonos]       = useState([]);
const [creditoSel,setCreditoSel] = useState(null);

// Form nuevo crédito
const [idCliente,setIdCliente]   = useState("");
const [idFactura,setIdFactura]   = useState("");
const [valorTotal,setValorTotal] = useState("");
const [fecha,setFecha]           = useState(new Date().toISOString().split("T")[0]);
const [observacion,setObservacion] = useState("");

// Form abono
const [valorAbono,setValorAbono]   = useState("");
const [fechaAbono,setFechaAbono]   = useState(new Date().toISOString().split("T")[0]);
const [obsAbono,setObsAbono]       = useState("");

const fmt = (n) => "$" + Number(n||0).toLocaleString("es-CO");

useEffect(()=>{
  obtenerCreditos();
  fetch("http://localhost/factufast-api/clientes/listar.php")
  .then(res=>res.json()).then(data=>setClientes(data));
},[]);

const obtenerCreditos = () => {
  fetch("http://localhost/factufast-api/creditos/listar.php")
  .then(res=>res.json()).then(data=>setCreditos(data));
};

const guardarCredito = (e) => {
  e.preventDefault();
  if(!idCliente || !valorTotal){ alert("Complete los campos"); return; }
  fetch("http://localhost/factufast-api/creditos/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      id_cliente:idCliente, id_factura:idFactura,
      valor_total:valorTotal, fecha, observacion
    })
  }).then(res=>res.json()).then(()=>{
    alert("✅ Crédito registrado");
    setIdCliente(""); setIdFactura(""); setValorTotal("");
    setObservacion(""); obtenerCreditos();
  });
};

const verAbonos = (credito) => {
  setCreditoSel(credito);
  fetch(`http://localhost/factufast-api/creditos/abonos.php?id=${credito.id_credito}`)
  .then(res=>res.json()).then(data=>setAbonos(data));
};

const registrarAbono = (e) => {
  e.preventDefault();
  if(!valorAbono){ alert("Ingrese el valor del abono"); return; }
  if(Number(valorAbono) > Number(creditoSel.saldo)){
    alert("El abono supera el saldo pendiente"); return;
  }
  fetch("http://localhost/factufast-api/creditos/abonar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      id_credito: creditoSel.id_credito,
      valor: valorAbono, fecha: fechaAbono,
      observacion: obsAbono
    })
  }).then(res=>res.json()).then(()=>{
    alert("✅ Abono registrado");
    setValorAbono(""); setObsAbono("");
    obtenerCreditos();
    verAbonos({ ...creditoSel, saldo: creditoSel.saldo - Number(valorAbono) });
  });
};

const totalPendiente = creditos
  .filter(c=>c.estado==="pendiente")
  .reduce((t,c)=>t+Number(c.saldo),0);

return(
<div className="gerente-container">

  <h2 style={{ color:C.dorado }}>💳 Créditos y Abonos</h2>

  {/* RESUMEN */}
  <div style={{ display:"flex", gap:"16px", marginBottom:"24px" }}>
    <div style={{ background:C.rojo, color:C.blanco, padding:"14px 24px",
                  borderRadius:"8px", minWidth:"180px" }}>
      <p style={{ margin:0, fontSize:"11px" }}>TOTAL PENDIENTE</p>
      <h3 style={{ margin:"4px 0 0" }}>{fmt(totalPendiente)}</h3>
    </div>
    <div style={{ background:C.dorado, color:C.blanco, padding:"14px 24px",
                  borderRadius:"8px", minWidth:"180px" }}>
      <p style={{ margin:0, fontSize:"11px" }}>CRÉDITOS ACTIVOS</p>
      <h3 style={{ margin:"4px 0 0" }}>
        {creditos.filter(c=>c.estado==="pendiente").length}
      </h3>
    </div>
  </div>

  {/* FORMULARIO NUEVO CRÉDITO */}
  <div style={{ background:C.cremaSuave, padding:"20px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>➕ Registrar Crédito</h3>
    <form onSubmit={guardarCredito}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Cliente</label>
          <select style={inpStyle} value={idCliente}
            onChange={(e)=>setIdCliente(e.target.value)}>
            <option value="">Seleccione cliente</option>
            {clientes.map(c=>(
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre_cliente}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>
            N° Factura (opcional)
          </label>
          <input style={inpStyle} placeholder="Ej: 35"
            value={idFactura} onChange={(e)=>setIdFactura(e.target.value)} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Valor total</label>
          <input type="number" style={inpStyle} placeholder="0"
            value={valorTotal} onChange={(e)=>setValorTotal(e.target.value)} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Fecha</label>
          <input type="date" style={inpStyle} value={fecha}
            onChange={(e)=>setFecha(e.target.value)} />
        </div>

        <div style={{ gridColumn:"1 / -1" }}>
          <label style={{ fontWeight:"bold", color:C.texto }}>Observación</label>
          <input style={inpStyle} placeholder="Ej: Puerta corrediza, abonó $300.000"
            value={observacion} onChange={(e)=>setObservacion(e.target.value)} />
        </div>

      </div>
      <button type="submit" style={btnStyle}>💾 Guardar Crédito</button>
    </form>
  </div>

  {/* LISTA CRÉDITOS */}
  <h3 style={{ color:C.dorado }}>📋 Lista de Créditos</h3>
  <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"30px" }}>
    <thead>
      <tr>
        <th style={thStyle}>Cliente</th>
        <th style={thStyle}>Teléfono</th>
        <th style={thStyle}>Factura</th>
        <th style={thStyle}>Total</th>
        <th style={thStyle}>Saldo</th>
        <th style={thStyle}>Fecha</th>
        <th style={thStyle}>Estado</th>
        <th style={thStyle}>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {creditos.map((c,i)=>(
        <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
          <td style={tdStyle}>{c.nombre_cliente}</td>
          <td style={tdStyle}>{c.telefono_cliente}</td>
          <td style={tdStyle}>{c.id_factura ? `FAC-${String(c.id_factura).padStart(4,"0")}` : "—"}</td>
          <td style={tdStyle}>{fmt(c.valor_total)}</td>
          <td style={{ ...tdStyle,
            color: c.estado==="cancelado" ? C.verde : C.rojo,
            fontWeight:"bold" }}>
            {fmt(c.saldo)}
          </td>
          <td style={tdStyle}>{c.fecha}</td>
          <td style={tdStyle}>
            <span style={{
              background: c.estado==="cancelado" ? C.verde : C.rojo,
              color:"white", padding:"3px 8px", borderRadius:"10px",
              fontSize:"12px"
            }}>
              {c.estado}
            </span>
          </td>
          <td style={tdStyle}>
            {c.estado === "pendiente" && (
              <button onClick={()=>verAbonos(c)}
                style={{ ...btnStyle, padding:"5px 10px", fontSize:"12px" }}>
                💰 Abonar
              </button>
            )}
            <button onClick={()=>verAbonos(c)}
              style={{ ...btnStyle, background:"#555",
                       padding:"5px 10px", fontSize:"12px" }}>
              Ver abonos
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* PANEL ABONOS */}
  {creditoSel && (
    <div style={{ background:C.cremaSuave, padding:"20px",
                  borderRadius:"10px", border:`2px solid ${C.dorado}` }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <h3 style={{ color:C.dorado, marginTop:0 }}>
          💰 Abonos — {creditoSel.nombre_cliente}
        </h3>
        <button onClick={()=>setCreditoSel(null)}
          style={{ ...btnStyle, background:"#666", padding:"5px 12px" }}>
          ✕ Cerrar
        </button>
      </div>

      <div style={{ display:"flex", gap:"16px", marginBottom:"16px" }}>
        <div style={{ background:C.rojo, color:C.blanco, padding:"10px 20px",
                      borderRadius:"8px" }}>
          <p style={{ margin:0, fontSize:"11px" }}>SALDO PENDIENTE</p>
          <h3 style={{ margin:"4px 0 0" }}>{fmt(creditoSel.saldo)}</h3>
        </div>
        <div style={{ background:C.dorado, color:C.blanco, padding:"10px 20px",
                      borderRadius:"8px" }}>
          <p style={{ margin:0, fontSize:"11px" }}>VALOR TOTAL</p>
          <h3 style={{ margin:"4px 0 0" }}>{fmt(creditoSel.valor_total)}</h3>
        </div>
      </div>

      {/* FORM ABONO */}
      {creditoSel.estado === "pendiente" && (
        <form onSubmit={registrarAbono} style={{ marginBottom:"20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 20px" }}>
            <div>
              <label style={{ fontWeight:"bold", color:C.texto }}>Valor abono</label>
              <input type="number" style={inpStyle} placeholder="0"
                value={valorAbono} onChange={(e)=>setValorAbono(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight:"bold", color:C.texto }}>Fecha</label>
              <input type="date" style={inpStyle} value={fechaAbono}
                onChange={(e)=>setFechaAbono(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight:"bold", color:C.texto }}>Observación</label>
              <input style={inpStyle} placeholder="Opcional"
                value={obsAbono} onChange={(e)=>setObsAbono(e.target.value)} />
            </div>
          </div>
          <button type="submit" style={{ ...btnStyle, background:C.verde }}>
            ✅ Registrar Abono
          </button>
        </form>
      )}

      {/* HISTORIAL ABONOS */}
      <h4 style={{ color:C.dorado }}>Historial de abonos</h4>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Valor</th>
            <th style={thStyle}>Observación</th>
          </tr>
        </thead>
        <tbody>
          {abonos.length === 0 ?
            <tr><td colSpan="3" style={tdStyle}>Sin abonos registrados</td></tr>
            :
            abonos.map((a,i)=>(
              <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
                <td style={tdStyle}>{a.fecha}</td>
                <td style={tdStyle}>{fmt(a.valor)}</td>
                <td style={tdStyle}>{a.observacion || "—"}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )}

</div>
);
}

export default Creditos;