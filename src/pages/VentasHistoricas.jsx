import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import * as XLSX from 'xlsx';

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

function VentasHistoricas(){

const [ventas,setVentas]         = useState([]);
const [fecha,setFecha]           = useState(new Date().toISOString().split("T")[0]);
const [descripcion,setDescripcion] = useState("");
const [cantidad,setCantidad]     = useState(1);
const [precioUnit,setPrecioUnit] = useState("");
const [observacion,setObservacion] = useState("");
const [filtroInicio,setFiltroInicio] = useState("");
const [filtroFin,setFiltroFin]       = useState("");
const [totalVentas,setTotalVentas]   = useState(0);

const importRef = useRef();

useEffect(()=>{ obtenerVentas(); },[]);

const obtenerVentas = () => {
  fetch("http://localhost/factufast-api/ventas_historicas/listar.php")
  .then(res=>res.json())
  .then(data=>{
    setVentas(data);
    const total = data.reduce((t,v)=>t+Number(v.total),0);
    setTotalVentas(total);
  });
};

const total = Number(precioUnit||0) * Number(cantidad||1);
const fmt   = (n) => "$" + Number(n||0).toLocaleString("es-CO");

const guardar = (e) => {
  e.preventDefault();
  if(!descripcion || !precioUnit){ alert("Complete descripción y precio"); return; }
  fetch("http://localhost/factufast-api/ventas_historicas/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      fecha, descripcion, cantidad,
      precio_unit: precioUnit,
      total:       total,
      observacion
    })
  }).then(res=>res.json()).then(()=>{
    alert("✅ Venta registrada");
    setDescripcion(""); setCantidad(1);
    setPrecioUnit(""); setObservacion("");
    obtenerVentas();
  });
};

const eliminar = (id) => {
  if(!window.confirm("¿Eliminar venta?")) return;
  fetch(`http://localhost/factufast-api/ventas_historicas/eliminar.php?id=${id}`)
  .then(res=>res.json()).then(()=>obtenerVentas());
};

const ventasFiltradas = ventas.filter(v => {
  if(filtroInicio && v.fecha < filtroInicio) return false;
  if(filtroFin    && v.fecha > filtroFin)    return false;
  return true;
});

const totalFiltrado = ventasFiltradas.reduce((t,v)=>t+Number(v.total),0);

// ✅ EXPORTAR
const exportar = () => {
  if(!ventasFiltradas.length){ alert("No hay datos"); return; }
  const ws = XLSX.utils.json_to_sheet(ventasFiltradas.map(v=>({
    Fecha:        v.fecha,
    Descripción:  v.descripcion,
    Cantidad:     v.cantidad,
    "Precio unit":v.precio_unit,
    Total:        v.total,
    Observación:  v.observacion
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  XLSX.writeFile(wb, `ventas_historicas_${filtroInicio||"todo"}_${filtroFin||"todo"}.xlsx`);
};

// ✅ IMPORTAR
const importar = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const wb    = XLSX.read(evt.target.result, { type:"binary", cellDates:true });
    const ws    = wb.Sheets[wb.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(ws, { dateNF:"yyyy-mm-dd" });

    const filasLimpias = filas.map(f=>({
      ...f,
      fecha: f.fecha instanceof Date
        ? f.fecha.toISOString().split("T")[0]
        : String(f.fecha).substring(0,10)
    }));

    if(!filasLimpias.length){ alert("Archivo vacío"); return; }
    if(!window.confirm(`¿Importar ${filasLimpias.length} ventas?`)) return;

    const res  = await fetch("http://localhost/factufast-api/ventas_historicas/importar.php",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ filas: filasLimpias })
    });
    const data = await res.json();
    alert(`✅ Importadas: ${data.insertados} | ❌ Errores: ${data.errores}`);
    obtenerVentas();
  };
  reader.readAsBinaryString(file);
  e.target.value = "";
};

// ✅ DESCARGAR PLANTILLA
const descargarPlantilla = () => {
  const ws = XLSX.utils.json_to_sheet([{
    fecha:       "2026-03-23",
    descripcion: "Espejo de lujo",
    cantidad:    1,
    precio_unit: 250000,
    total:       250000,
    observacion: "Abonó 100k"
  }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
  XLSX.writeFile(wb, "plantilla_ventas_historicas.xlsx");
};

return(
<div className="gerente-container">

  <h2 style={{ color:C.dorado }}>🧾 Ventas Históricas</h2>
  <p style={{ color:"#666", marginBottom:"16px" }}>
    Registro de ventas anteriores sin relación con el inventario actual.
  </p>

  {/* TARJETA TOTAL */}
  <div style={{ display:"flex", gap:"16px", marginBottom:"24px" }}>
    <div style={{ background:C.dorado, color:C.blanco, padding:"14px 24px",
                  borderRadius:"8px", minWidth:"180px" }}>
      <p style={{ margin:0, fontSize:"11px" }}>TOTAL VENTAS HISTÓRICAS</p>
      <h3 style={{ margin:"4px 0 0" }}>{fmt(totalVentas)}</h3>
    </div>
    <div style={{ background:C.cremaSuave, color:C.texto, padding:"14px 24px",
                  borderRadius:"8px", minWidth:"180px",
                  border:`1px solid ${C.doradoClaro}` }}>
      <p style={{ margin:0, fontSize:"11px" }}>VENTAS FILTRADAS</p>
      <h3 style={{ margin:"4px 0 0" }}>{fmt(totalFiltrado)}</h3>
    </div>
  </div>

  {/* FORMULARIO */}
  <div style={{ background:C.cremaSuave, padding:"20px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>➕ Registrar Venta</h3>
    <form onSubmit={guardar}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Fecha</label>
          <input type="date" style={inpStyle} value={fecha}
            onChange={(e)=>setFecha(e.target.value)} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Descripción</label>
          <input style={inpStyle} placeholder="Ej: Espejo de lujo 1.20x70"
            value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Cantidad</label>
          <input type="number" style={inpStyle} value={cantidad}
            onChange={(e)=>setCantidad(e.target.value)} min="1" />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Precio unitario</label>
          <input type="number" style={inpStyle} placeholder="0"
            value={precioUnit} onChange={(e)=>setPrecioUnit(e.target.value)} />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Total calculado</label>
          <input style={{ ...inpStyle, background:"#f0f0f0" }}
            value={fmt(total)} disabled />
        </div>

        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Observación</label>
          <input style={inpStyle} placeholder="Ej: Abonó $100.000"
            value={observacion} onChange={(e)=>setObservacion(e.target.value)} />
        </div>

      </div>
      <button type="submit" style={btnStyle}>💾 Guardar Venta</button>
    </form>
  </div>

  {/* EXCEL */}
  <div style={{ background:C.cremaSuave, padding:"16px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>📊 Excel</h3>
    <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" }}>

      <button onClick={descargarPlantilla}
        style={{ ...btnStyle, background:C.doradoClaro, color:C.texto }}>
        📥 Descargar Plantilla
      </button>

      <button onClick={()=>importRef.current.click()}
        style={{ ...btnStyle, background:C.verde }}>
        📂 Importar Excel
      </button>
      <input ref={importRef} type="file" accept=".xlsx,.xls"
        style={{ display:"none" }} onChange={importar} />

      <input type="date" value={filtroInicio}
        onChange={(e)=>setFiltroInicio(e.target.value)}
        style={{ padding:"8px", borderRadius:"6px",
                 border:`1px solid ${C.doradoClaro}` }} />
      <input type="date" value={filtroFin}
        onChange={(e)=>setFiltroFin(e.target.value)}
        style={{ padding:"8px", borderRadius:"6px",
                 border:`1px solid ${C.doradoClaro}` }} />

      <button onClick={exportar} style={btnStyle}>
        📤 Exportar Excel
      </button>

    </div>
  </div>

  {/* TABLA */}
  <h3 style={{ color:C.dorado }}>📋 Historial</h3>
  <table style={{ width:"100%", borderCollapse:"collapse" }}>
    <thead>
      <tr>
        <th style={thStyle}>Fecha</th>
        <th style={thStyle}>Descripción</th>
        <th style={thStyle}>Cantidad</th>
        <th style={thStyle}>Precio unit</th>
        <th style={thStyle}>Total</th>
        <th style={thStyle}>Observación</th>
        <th style={thStyle}>Acción</th>
      </tr>
    </thead>
    <tbody>
      {ventasFiltradas.length === 0 ?
        <tr><td colSpan="7" style={{ ...tdStyle, textAlign:"center" }}>
          No hay ventas registradas
        </td></tr>
        :
        ventasFiltradas.map((v,i)=>(
          <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{v.fecha}</td>
            <td style={tdStyle}>{v.descripcion}</td>
            <td style={tdStyle}>{v.cantidad}</td>
            <td style={tdStyle}>{fmt(v.precio_unit)}</td>
            <td style={{ ...tdStyle, fontWeight:"bold", color:C.verde }}>
              {fmt(v.total)}
            </td>
            <td style={tdStyle}>{v.observacion || "—"}</td>
            <td style={tdStyle}>
              <button onClick={()=>eliminar(v.id_venta)}
                style={{ ...btnStyle, background:C.rojo,
                         padding:"5px 10px", fontSize:"12px" }}>
                Eliminar
              </button>
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>

</div>
);
}

export default VentasHistoricas;