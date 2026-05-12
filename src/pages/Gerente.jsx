import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

const C = {
  dorado:"#8B7A00", doradoClaro:"#C4B456", crema:"#D4C98A",
  cremaSuave:"#EDE8C8", blanco:"#ffffff", texto:"#3a3300",
  rojo:"#b71c1c", verde:"#2e7d32"
};

function Gerente() {

  const navigate  = useNavigate();
  const [totales,   setTotales]   = useState({});
  const [stockBajo, setStockBajo] = useState([]);
  const [creditos,  setCreditos]  = useState([]);
  const [gastosMes, setGastosMes] = useState(0);

  useEffect(()=>{
    // Resumen reportes
    fetch("http://localhost/factufast-api/reportes/resumen.php")
    .then(res=>res.json())
    .then(data=>{
      setTotales(data.totales || {});
      setStockBajo(data.stock_bajo || []);
    });

    // Créditos pendientes
    fetch("http://localhost/factufast-api/creditos/listar.php")
    .then(res=>res.json())
    .then(data=>{
      const pendientes = data.filter(c=>c.estado==="pendiente");
      setCreditos(pendientes);
    });

    // Gastos del mes
    const mes = new Date().toISOString().slice(0,7);
    fetch(`http://localhost/factufast-api/gastos/resumen.php?mes=${mes}`)
    .then(res=>res.json())
    .then(data=>setGastosMes(data.total_mes || 0));

  },[]);

  const fmt = (n) => "$" + Number(n||0).toLocaleString("es-CO");

  const totalPendiente = creditos.reduce((t,c)=>t+Number(c.saldo),0);

  const tarjeta = (titulo, valor, color, ruta) => (
    <div onClick={()=>ruta && navigate(ruta)}
      style={{
        background: color, color: C.texto,
        padding:"18px 24px", borderRadius:"10px",
        minWidth:"180px", cursor: ruta ? "pointer" : "default",
        boxShadow:"0 2px 6px rgba(0,0,0,0.12)",
        border:`1px solid ${C.dorado}`,
        transition:"transform 0.1s"
      }}
      onMouseEnter={e=>{ if(ruta) e.currentTarget.style.transform="scale(1.02)" }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)" }}
    >
      <p style={{ margin:0, fontSize:"11px", fontWeight:"bold",
                  textTransform:"uppercase", opacity:0.7 }}>
        {titulo}
      </p>
      <h3 style={{ margin:"6px 0 0", fontSize:"22px" }}>{valor}</h3>
    </div>
  );

  return (
  <div className="gerente-container">

    <h2 style={{ color:C.dorado }}>🏠 Panel Principal</h2>
    <p style={{ color:"#666", marginBottom:"24px" }}>
      Resumen general del negocio
    </p>

    {/* TARJETAS */}
    <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"32px" }}>
      {tarjeta("💰 Valor Inventario",   fmt(totales.valor_inventario),   C.cremaSuave, "/gerente/inventario")}
      {tarjeta("📈 Ganancia Real",      fmt(totales.ganancia_total),     C.crema,      "/gerente/reportes")}
      {tarjeta("📊 Ganancia Potencial", fmt(totales.ganancia_potencial), C.doradoClaro,"/gerente/reportes")}
      {tarjeta("🧾 Total Facturas",     totales.total_facturas || 0,     C.cremaSuave, "/gerente/listado-facturas")}
      {tarjeta("💸 Gastos del Mes",     fmt(gastosMes),                  C.crema,      "/gerente/gastos")}
      {tarjeta("💳 Créditos Pendientes",fmt(totalPendiente),             "#ffd6d6",    "/gerente/creditos")}
    </div>

    {/* ALERTAS STOCK BAJO */}
    {stockBajo.length > 0 && (
      <div style={{
        background:"#fff3cd", border:"1px solid #ffc107",
        borderRadius:"10px", padding:"16px", marginBottom:"24px"
      }}>
        <h3 style={{ color:"#856404", margin:"0 0 12px" }}>
          ⚠ Productos con stock bajo
        </h3>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          {stockBajo.map((p,i)=>(
            <span key={i} style={{
              background:"#ffc107", padding:"6px 12px",
              borderRadius:"20px", fontSize:"13px", fontWeight:"bold"
            }}>
              {p.nombre_producto} — {p.stock} unid.
            </span>
          ))}
        </div>
        <button onClick={()=>navigate("/gerente/inventario")}
          style={{ marginTop:"12px", background:"#856404", color:"white",
                   border:"none", padding:"7px 14px", borderRadius:"6px",
                   cursor:"pointer" }}>
          Ver inventario →
        </button>
      </div>
    )}

    {/* CRÉDITOS PENDIENTES */}
    {creditos.length > 0 && (
      <div style={{
        background:"#fde8e8", border:"1px solid #f44336",
        borderRadius:"10px", padding:"16px", marginBottom:"24px"
      }}>
        <h3 style={{ color:C.rojo, margin:"0 0 12px" }}>
          💳 Clientes con saldo pendiente
        </h3>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th style={{ ...{background:C.rojo, color:C.blanco,
                             padding:"8px", textAlign:"left"} }}>
                Cliente
              </th>
              <th style={{ background:C.rojo, color:C.blanco,
                           padding:"8px", textAlign:"left" }}>
                Saldo
              </th>
              <th style={{ background:C.rojo, color:C.blanco,
                           padding:"8px", textAlign:"left" }}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {creditos.map((c,i)=>(
              <tr key={i} style={{ background: i%2===0 ? C.blanco : "#fff0f0" }}>
                <td style={{ padding:"8px" }}>{c.nombre_cliente}</td>
                <td style={{ padding:"8px", color:C.rojo, fontWeight:"bold" }}>
                  {fmt(c.saldo)}
                </td>
                <td style={{ padding:"8px" }}>{c.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={()=>navigate("/gerente/creditos")}
          style={{ marginTop:"12px", background:C.rojo, color:"white",
                   border:"none", padding:"7px 14px", borderRadius:"6px",
                   cursor:"pointer" }}>
          Ver todos los créditos →
        </button>
      </div>
    )}

    {/* ACCESOS RÁPIDOS */}
    <h3 style={{ color:C.dorado }}>⚡ Accesos rápidos</h3>
    <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
      {[
        { label:"➕ Nueva Factura",  ruta:"/gerente/facturas" },
        { label:"📦 Inventario",     ruta:"/gerente/inventario" },
        { label:"👥 Clientes",       ruta:"/gerente/clientes" },
        { label:"💸 Gastos",         ruta:"/gerente/gastos" },
        { label:"💳 Créditos",       ruta:"/gerente/creditos" },
        { label:"📊 Reportes",       ruta:"/gerente/reportes" },
        { label:"👤 Terceros",       ruta:"/gerente/terceros" },
      ].map((a,i)=>(
        <button key={i} onClick={()=>navigate(a.ruta)}
          style={{
            background:C.dorado, color:C.blanco,
            padding:"10px 18px", border:"none",
            borderRadius:"8px", cursor:"pointer",
            fontSize:"14px", fontWeight:"bold"
          }}>
          {a.label}
        </button>
      ))}
    </div>

  </div>
  );
}

export default Gerente;