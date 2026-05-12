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

const CATEGORIAS = [
  "Utiles de aseo","Materiales","Transporte","Nómina",
  "Herramientas","Servicios","Alimentación","Pago Proveedores",
  "Pago Facturas","Arriendo","Servicios Públicos","Otros"
];

function Gastos(){

// ✅ Leer rol PRIMERO antes de cualquier hook
const usuario   = JSON.parse(localStorage.getItem("usuario") || "{}");
const rol       = usuario.rol || "";
const esGerente = rol === "Gerente 1";
const esAdmin   = rol === "Administrador";

// ✅ TODOS los hooks primero
const [gastos,setGastos]           = useState([]);
const [terceros,setTerceros]       = useState([]);
const [fecha,setFecha]             = useState(new Date().toISOString().split("T")[0]);
const [descripcion,setDescripcion] = useState("");
const [valor,setValor]             = useState("");
const [categoria,setCategoria]     = useState("");
const [idTercero,setIdTercero]     = useState("");
const [mes,setMes]                 = useState(new Date().toISOString().slice(0,7));
const [resumen,setResumen]         = useState({ categorias:[], total_mes:0 });
const [filtroInicio,setFiltroInicio] = useState("");
const [filtroFin,setFiltroFin]       = useState("");
const [busqueda,setBusqueda]         = useState("");
const importRef = useRef();

useEffect(()=>{
  if(!esGerente && !esAdmin) return;
  obtenerGastos();
  obtenerTerceros();
  obtenerResumen();
},[]);

const obtenerGastos = () => {
  fetch("http://localhost/factufast-api/gastos/listar.php")
  .then(res=>res.json()).then(data=>setGastos(data));
};

const obtenerTerceros = () => {
  fetch("http://localhost/factufast-api/terceros/listar.php")
  .then(res=>res.json()).then(data=>setTerceros(data));
};

const obtenerResumen = () => {
  fetch(`http://localhost/factufast-api/gastos/resumen.php?mes=${mes}`)
  .then(res=>res.json()).then(data=>setResumen(data));
};

const guardarGasto = (e) => {
  e.preventDefault();
  if(!descripcion || !valor){ alert("Complete descripción y valor"); return; }
  fetch("http://localhost/factufast-api/gastos/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ fecha, descripcion, valor, categoria, id_tercero:idTercero })
  }).then(res=>res.json()).then(()=>{
    alert("✅ Gasto registrado");
    setDescripcion(""); setValor(""); setCategoria(""); setIdTercero("");
    obtenerGastos(); obtenerResumen();
  });
};

const eliminarGasto = (id) => {
  if(!window.confirm("¿Eliminar gasto?")) return;
  fetch(`http://localhost/factufast-api/gastos/eliminar.php?id=${id}`)
  .then(res=>res.json()).then(()=>obtenerGastos());
};

const fmt = (n) => "$" + Number(n||0).toLocaleString("es-CO");

const gastosFiltrados = gastos.filter(g => {
  if(filtroInicio && g.fecha < filtroInicio) return false;
  if(filtroFin    && g.fecha > filtroFin)    return false;
  if(busqueda){
    const b = busqueda.toLowerCase();
    const enDescripcion = g.descripcion?.toLowerCase().includes(b);
    const enTercero     = g.nombre_tercero?.toLowerCase().includes(b);
    const enCategoria   = g.categoria?.toLowerCase().includes(b);
    if(!enDescripcion && !enTercero && !enCategoria) return false;
  }
  return true;
});

const totalFiltrado = gastosFiltrados.reduce((t,g)=>t+Number(g.valor),0);

const descargarPlantilla = () => {
  const ws = XLSX.utils.json_to_sheet([{
    fecha:"2026-03-21", descripcion:"Compra de materiales",
    valor:50000, categoria:"Materiales", tercero:"Anderson"
  }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
  XLSX.writeFile(wb, "plantilla_gastos.xlsx");
};

const exportarGastos = () => {
  if(!gastosFiltrados.length){ alert("No hay datos en ese rango"); return; }
  const ws = XLSX.utils.json_to_sheet(gastosFiltrados.map(g=>({
    Fecha:       g.fecha,
    Descripción: g.descripcion,
    Categoría:   g.categoria || "Sin categoría",
    Tercero:     g.nombre_tercero || "—",
    Valor:       g.valor
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gastos");
  XLSX.writeFile(wb, `gastos_${filtroInicio||"todo"}_${filtroFin||"todo"}.xlsx`);
};

const importarGastos = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const wb    = XLSX.read(evt.target.result, { type:"binary", cellDates:true });
    const ws    = wb.Sheets[wb.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(ws, { dateNF:"yyyy-mm-dd" });
    const filasLimpias = filas.map(f=>({
      fecha:       f.fecha instanceof Date
                   ? f.fecha.toISOString().split("T")[0]
                   : String(f.fecha).substring(0,10),
      descripcion: f.descripcion || "",
      valor:       f.valor || 0,
      categoria:   f.categoria || "",
      tercero:     f.tercero   || ""
    }));
    if(!filasLimpias.length){ alert("Archivo vacío"); return; }
    if(!window.confirm(`¿Importar ${filasLimpias.length} gastos?`)) return;
    let insertados = 0; let errores = 0;
    for(const f of filasLimpias){
      try{
        const res = await fetch("http://localhost/factufast-api/gastos/guardar.php",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify(f)
        });
        const data = await res.json();
        if(data.ok) insertados++; else errores++;
      } catch { errores++; }
    }
    alert(`✅ Importados: ${insertados} | ❌ Errores: ${errores}`);
    obtenerGastos();
  };
  reader.readAsBinaryString(file);
  e.target.value = "";
};

// ✅ Control de acceso AL FINAL antes del return
if(!esGerente && !esAdmin){
  return(
    <div className="gerente-container">
      <h2 style={{ color:C.rojo }}>🚫 Sin acceso</h2>
      <p>No tienes permiso para ver esta sección.</p>
    </div>
  );
}

return(
<div className="gerente-container">

  <h2 style={{ color:C.dorado }}>💸 Gastos</h2>

  {/* FORMULARIO */}
  <div style={{ background:C.cremaSuave, padding:"20px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>Registrar Gasto</h3>
    <form onSubmit={guardarGasto}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Fecha</label>
          <input type="date" style={inpStyle} value={fecha}
            onChange={(e)=>setFecha(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Categoría</label>
          <select style={inpStyle} value={categoria}
            onChange={(e)=>setCategoria(e.target.value)}>
            <option value="">Sin categoría</option>
            {CATEGORIAS.map(c=>(
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={{ fontWeight:"bold", color:C.texto }}>Descripción</label>
          <input style={inpStyle} placeholder="Ej: Compra de tubos aluminio"
            value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Valor</label>
          <input type="number" style={inpStyle} placeholder="0"
            value={valor} onChange={(e)=>setValor(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight:"bold", color:C.texto }}>Tercero (opcional)</label>
          <select style={inpStyle} value={idTercero}
            onChange={(e)=>setIdTercero(e.target.value)}>
            <option value="">Sin tercero</option>
            {terceros.map(t=>(
              <option key={t.id_tercero} value={t.id_tercero}>
                {t.nombre} — {t.tipo}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" style={btnStyle}>➕ Registrar Gasto</button>
    </form>
  </div>

  {/* RESUMEN DEL MES */}
  <div style={{ background:C.cremaSuave, padding:"20px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <h3 style={{ color:C.dorado, margin:0 }}>📊 Resumen del mes</h3>
      <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
        <input type="month" value={mes}
          onChange={(e)=>setMes(e.target.value)}
          style={{ padding:"6px", borderRadius:"6px",
                   border:`1px solid ${C.doradoClaro}` }} />
        <button onClick={obtenerResumen} style={btnStyle}>Ver</button>
      </div>
    </div>
    <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginTop:"16px" }}>
      <div style={{ background:C.dorado, color:C.blanco, padding:"14px 24px",
                    borderRadius:"8px", minWidth:"160px" }}>
        <p style={{ margin:0, fontSize:"11px" }}>TOTAL GASTOS MES</p>
        <h3 style={{ margin:"4px 0 0" }}>{fmt(resumen.total_mes)}</h3>
      </div>
    </div>
    <table style={{ width:"100%", borderCollapse:"collapse", marginTop:"16px" }}>
      <thead>
        <tr>
          <th style={thStyle}>Categoría</th>
          <th style={thStyle}>Total</th>
        </tr>
      </thead>
      <tbody>
        {resumen.categorias.map((c,i)=>(
          <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{c.categoria || "Sin categoría"}</td>
            <td style={tdStyle}>{fmt(c.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* EXCEL */}
  <div style={{ background:C.cremaSuave, padding:"16px",
                borderRadius:"10px", border:`1px solid ${C.doradoClaro}`,
                marginBottom:"24px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>📊 Excel - Importar / Exportar</h3>
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
        style={{ display:"none" }} onChange={importarGastos} />
      <input type="date" value={filtroInicio}
        onChange={(e)=>setFiltroInicio(e.target.value)}
        style={{ padding:"7px", borderRadius:"6px",
                 border:`1px solid ${C.doradoClaro}` }} />
      <input type="date" value={filtroFin}
        onChange={(e)=>setFiltroFin(e.target.value)}
        style={{ padding:"7px", borderRadius:"6px",
                 border:`1px solid ${C.doradoClaro}` }} />
      <button onClick={exportarGastos} style={btnStyle}>
        📤 Exportar Excel
      </button>
    </div>
    <p style={{ fontSize:"12px", color:"#666", margin:"8px 0 0" }}>
      💡 Descarga la plantilla, llénala con los gastos históricos e impórtala
    </p>
  </div>

  {/* BUSCADOR */}
  <div style={{ display:"flex", gap:"10px", alignItems:"center",
                flexWrap:"wrap", marginBottom:"12px" }}>
    <input
      placeholder="🔍 Buscar por descripción, tercero o categoría..."
      value={busqueda}
      onChange={(e)=>setBusqueda(e.target.value)}
      style={{
        flex:1, padding:"9px", borderRadius:"6px",
        border:`1px solid ${C.doradoClaro}`,
        fontSize:"14px", minWidth:"250px"
      }}
    />
    {busqueda && (
      <button onClick={()=>setBusqueda("")}
        style={{ ...btnStyle, background:"#666", padding:"7px 12px" }}>
        ✕ Limpiar
      </button>
    )}
  </div>

  {/* RESUMEN FILTRO */}
  {(busqueda || filtroInicio || filtroFin) && gastosFiltrados.length > 0 && (
    <div style={{ background:C.cremaSuave, padding:"10px 16px",
                  borderRadius:"8px", marginBottom:"12px",
                  border:`1px solid ${C.doradoClaro}`,
                  display:"flex", gap:"20px", flexWrap:"wrap" }}>
      <span><b>Registros:</b> {gastosFiltrados.length}</span>
      <span><b>Total:</b>
        <b style={{ color:C.rojo }}> {fmt(totalFiltrado)}</b>
      </span>
      {busqueda && <span><b>Búsqueda:</b> "{busqueda}"</span>}
    </div>
  )}

  {/* HISTORIAL */}
  <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:"12px" }}>
    <h3 style={{ color:C.dorado, margin:0 }}>📋 Historial de Gastos</h3>
    <span style={{ color:C.rojo, fontWeight:"bold" }}>
      {gastosFiltrados.length} registros — {fmt(totalFiltrado)}
    </span>
  </div>

  <table style={{ width:"100%", borderCollapse:"collapse" }}>
    <thead>
      <tr>
        <th style={thStyle}>Fecha</th>
        <th style={thStyle}>Descripción</th>
        <th style={thStyle}>Categoría</th>
        <th style={thStyle}>Tercero</th>
        <th style={thStyle}>Valor</th>
        <th style={thStyle}>Acción</th>
      </tr>
    </thead>
    <tbody>
      {gastosFiltrados.length === 0 ?
        <tr><td colSpan="6" style={{ ...tdStyle, textAlign:"center" }}>
          No hay gastos registrados
        </td></tr>
        :
        gastosFiltrados.map((g,i)=>(
          <tr key={i} style={{ background: i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{g.fecha}</td>
            <td style={tdStyle}>{g.descripcion}</td>
            <td style={tdStyle}>{g.categoria || "—"}</td>
            <td style={tdStyle}>{g.nombre_tercero || "—"}</td>
            <td style={tdStyle}>{fmt(g.valor)}</td>
            <td style={tdStyle}>
              <button onClick={()=>eliminarGasto(g.id_gasto)}
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

export default Gastos;