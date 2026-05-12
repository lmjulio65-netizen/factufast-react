import React, {
  useEffect,
  useState,
} from 'react';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const C = {
  dorado:"#8B7A00", doradoClaro:"#C4B456", crema:"#D4C98A",
  cremaSuave:"#EDE8C8", oliva:"#6B6200", texto:"#3a3300",
  blanco:"#ffffff", rojo:"#b71c1c", verde:"#2e7d32"
};

const thStyle = { background:C.dorado, color:C.blanco, padding:"10px", textAlign:"left" };
const tdStyle = { padding:"8px 10px", borderBottom:`1px solid ${C.crema}` };

const Tarjeta = ({ bg, titulo, valor, subtitulo }) => (
  <div style={{
    background:bg, color:C.texto, padding:"18px 24px",
    borderRadius:"10px", minWidth:"180px",
    boxShadow:"0 2px 6px rgba(0,0,0,0.12)",
    border:`1px solid ${C.dorado}`
  }}>
    <p style={{ margin:0, fontSize:"11px", fontWeight:"bold",
                textTransform:"uppercase", opacity:0.7 }}>{titulo}</p>
    <h3 style={{ margin:"6px 0 0", fontSize:"22px" }}>{valor}</h3>
    {subtitulo && <p style={{ margin:"4px 0 0", fontSize:"11px", opacity:0.6 }}>{subtitulo}</p>}
  </div>
);

function Reportes(){

const [totales,setTotales]           = useState({});
const [ganancias,setGanancias]       = useState([]);
const [stockBajo,setStockBajo]       = useState([]);
const [ventasMes,setVentasMes]       = useState([]);
const [ventasHistMes,setVentasHistMes] = useState([]);
const [gastosMes,setGastosMes]       = useState([]);
const [topProductos,setTopProductos] = useState([]);

useEffect(()=>{
  fetch("http://localhost/factufast-api/reportes/resumen.php")
  .then(res=>res.json())
  .then(data=>{
    setTotales(data.totales           || {});
    setGanancias(data.ganancias       || []);
    setStockBajo(data.stock_bajo      || []);
    setVentasMes(data.ventas_mes      || []);
    setVentasHistMes(data.ventas_hist_mes || []);
    setGastosMes(data.gastos_mes      || []);
    setTopProductos(data.top_productos|| []);
  });
},[]);

const fmt = (n) => "$" + Number(n||0).toLocaleString("es-CO");

// Combinar ventas mes + ventas históricas por mes
const mesesUnicos = [...new Set([
  ...ventasMes.map(v=>v.mes),
  ...ventasHistMes.map(v=>v.mes),
  ...gastosMes.map(g=>g.mes)
])].sort();

const dataResumenMes = {
  labels: mesesUnicos,
  datasets:[
    {
      label:"Ventas inventario",
      data: mesesUnicos.map(m=>{
        const v = ventasMes.find(x=>x.mes===m);
        return v ? v.total_ventas : 0;
      }),
      backgroundColor: C.dorado
    },
    {
      label:"Ventas históricas",
      data: mesesUnicos.map(m=>{
        const v = ventasHistMes.find(x=>x.mes===m);
        return v ? v.total_ventas : 0;
      }),
      backgroundColor: C.doradoClaro
    },
    {
      label:"Gastos",
      data: mesesUnicos.map(m=>{
        const g = gastosMes.find(x=>x.mes===m);
        return g ? g.total_gastos : 0;
      }),
      backgroundColor: C.rojo
    }
  ]
};

const dataGanancias = {
  labels: ganancias.map(p=>p.nombre_producto),
  datasets:[{
    label:"Ganancia por producto",
    data:  ganancias.map(p=>p.ganancia),
    backgroundColor: C.dorado
  }]
};

const exportarGanancias = () => {
  if(!ganancias.length){ alert("No hay datos"); return; }
  const ws = XLSX.utils.json_to_sheet(ganancias.map(p=>({
    Producto:            p.nombre_producto,
    "Unidades vendidas": p.unidades_vendidas,
    "Total ventas ($)":  p.total_ventas,
    "Ganancia ($)":      p.ganancia
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ganancias");
  XLSX.writeFile(wb, "reporte_ganancias.xlsx");
};

const exportarResumenMes = () => {
  if(!mesesUnicos.length){ alert("No hay datos"); return; }
  const datos = mesesUnicos.map(m=>{
    const vi = ventasMes.find(x=>x.mes===m);
    const vh = ventasHistMes.find(x=>x.mes===m);
    const g  = gastosMes.find(x=>x.mes===m);
    const tv = Number(vi?.total_ventas||0) + Number(vh?.total_ventas||0);
    const tg = Number(g?.total_gastos||0);
    return {
      Mes:                    m,
      "Ventas inventario ($)":vi?.total_ventas || 0,
      "Ventas históricas ($)":vh?.total_ventas || 0,
      "Total ventas ($)":     tv,
      "Gastos ($)":           tg,
      "Diferencia ($)":       tv - tg
    };
  });
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Resumen mensual");
  XLSX.writeFile(wb, "resumen_mensual.xlsx");
};

const utilidadNeta = Number(totales.utilidad_neta || 0);

return(
<div className="gerente-container">

  <h2 style={{ color:C.oliva }}>📊 Reportes del Negocio</h2>

  {/* ══ RESUMEN FINANCIERO GENERAL ══ */}
  <h3 style={{ color:C.dorado }}>💼 Resumen Financiero General</h3>
  <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"16px" }}>
    <Tarjeta bg={C.cremaSuave} titulo="📦 Valor Inventario"
      valor={fmt(totales.valor_inventario)} />
    <Tarjeta bg={C.crema} titulo="💰 Total Invertido"
      valor={fmt(totales.total_invertido)} />
    <Tarjeta bg={C.doradoClaro} titulo="🧾 Ventas Inventario"
      valor={fmt(totales.ventas_inventario)} />
    <Tarjeta bg={C.cremaSuave} titulo="📋 Ventas Históricas"
      valor={fmt(totales.ventas_historicas)} />
  </div>

  {/* CÁLCULO FINAL */}
  <div style={{ background:C.cremaSuave, padding:"20px", borderRadius:"10px",
                border:`2px solid ${C.dorado}`, marginBottom:"28px" }}>
    <h3 style={{ color:C.dorado, marginTop:0 }}>🧮 Balance General</h3>
    <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>

      <div style={{ background:C.dorado, color:C.blanco, padding:"14px 24px",
                    borderRadius:"8px", minWidth:"180px" }}>
        <p style={{ margin:0, fontSize:"11px" }}>TOTAL VENTAS</p>
        <h3 style={{ margin:"4px 0 0" }}>{fmt(totales.total_ventas)}</h3>
        <p style={{ margin:"4px 0 0", fontSize:"11px", opacity:0.8 }}>
          Inventario + Históricas
        </p>
      </div>

      <div style={{ background:C.rojo, color:C.blanco, padding:"14px 24px",
                    borderRadius:"8px", minWidth:"180px" }}>
        <p style={{ margin:0, fontSize:"11px" }}>TOTAL GASTOS</p>
        <h3 style={{ margin:"4px 0 0" }}>{fmt(totales.total_gastos)}</h3>
      </div>

      <div style={{ background:"#fff3cd", color:C.texto, padding:"14px 24px",
                    borderRadius:"8px", minWidth:"180px",
                    border:`1px solid ${C.dorado}` }}>
        <p style={{ margin:0, fontSize:"11px" }}>💳 CRÉDITOS PENDIENTES</p>
        <h3 style={{ margin:"4px 0 0", color:C.rojo }}>
          {fmt(totales.creditos_pendientes)}
        </h3>
        <p style={{ margin:"4px 0 0", fontSize:"11px", opacity:0.7 }}>
          Por cobrar
        </p>
      </div>

      <div style={{
        background: utilidadNeta >= 0 ? C.verde : C.rojo,
        color:C.blanco, padding:"14px 24px",
        borderRadius:"8px", minWidth:"180px"
      }}>
        <p style={{ margin:0, fontSize:"11px" }}>
          {utilidadNeta >= 0 ? "✅ UTILIDAD NETA" : "❌ PÉRDIDA NETA"}
        </p>
        <h3 style={{ margin:"4px 0 0" }}>{fmt(utilidadNeta)}</h3>
        <p style={{ margin:"4px 0 0", fontSize:"11px", opacity:0.8 }}>
          Ventas - Gastos
        </p>
      </div>

    </div>

    {/* FÓRMULA VISUAL */}
    <div style={{ marginTop:"16px", padding:"12px", background:C.blanco,
                  borderRadius:"8px", fontSize:"14px", color:C.texto }}>
      <b>Fórmula:</b> {fmt(totales.total_ventas)} (ventas)
      &nbsp;−&nbsp; {fmt(totales.total_gastos)} (gastos)
      &nbsp;=&nbsp;
      <b style={{ color: utilidadNeta >= 0 ? C.verde : C.rojo }}>
        {fmt(utilidadNeta)}
      </b>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <b>Por cobrar:</b> {fmt(totales.creditos_pendientes)}
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <b>Si cobras todo:</b>&nbsp;
      <b style={{ color:C.verde }}>
        {fmt(utilidadNeta + Number(totales.creditos_pendientes||0))}
      </b>
    </div>
  </div>

  {/* GRÁFICA VENTAS VS GASTOS POR MES */}
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <h3 style={{ color:C.dorado }}>📅 Ventas vs Gastos por Mes</h3>
    <button onClick={exportarResumenMes} style={{
      background:C.dorado, color:C.blanco, padding:"7px 14px",
      border:"none", borderRadius:"6px", cursor:"pointer"
    }}>
      📤 Exportar Excel
    </button>
  </div>
  <div style={{ maxWidth:"800px", marginBottom:"30px", background:C.blanco,
                padding:"16px", borderRadius:"10px", border:`1px solid ${C.crema}` }}>
    <Bar data={dataResumenMes} />
  </div>

  {/* TOP 5 */}
  <h3 style={{ color:C.dorado }}>🏆 Top 5 Productos más Vendidos</h3>
  <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"28px" }}>
    <thead>
      <tr>
        <th style={thStyle}>#</th>
        <th style={thStyle}>Producto</th>
        <th style={thStyle}>Unidades vendidas</th>
      </tr>
    </thead>
    <tbody>
      {topProductos.length === 0 ?
        <tr><td colSpan="3" style={tdStyle}>Sin datos aún</td></tr>
        :
        topProductos.map((p,i)=>(
          <tr key={i} style={{ background:i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{i+1}</td>
            <td style={tdStyle}>{p.nombre_producto}</td>
            <td style={tdStyle}>{p.total_vendido}</td>
          </tr>
        ))
      }
    </tbody>
  </table>

  {/* GANANCIA POR PRODUCTO */}
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <h3 style={{ color:C.dorado }}>💵 Ganancia por Producto</h3>
    <button onClick={exportarGanancias} style={{
      background:C.dorado, color:C.blanco, padding:"7px 14px",
      border:"none", borderRadius:"6px", cursor:"pointer"
    }}>
      📤 Exportar Excel
    </button>
  </div>
  <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"28px" }}>
    <thead>
      <tr>
        <th style={thStyle}>Producto</th>
        <th style={thStyle}>Unidades vendidas</th>
        <th style={thStyle}>Total ventas</th>
        <th style={thStyle}>Ganancia</th>
      </tr>
    </thead>
    <tbody>
      {ganancias.length === 0 ?
        <tr><td colSpan="4" style={tdStyle}>Sin datos aún</td></tr>
        :
        ganancias.map((p,i)=>(
          <tr key={i} style={{ background:i%2===0 ? C.blanco : C.cremaSuave }}>
            <td style={tdStyle}>{p.nombre_producto}</td>
            <td style={tdStyle}>{p.unidades_vendidas}</td>
            <td style={tdStyle}>{fmt(p.total_ventas)}</td>
            <td style={{ ...tdStyle, color:C.verde, fontWeight:"bold" }}>
              {fmt(p.ganancia)}
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>

  {/* GRÁFICA GANANCIAS */}
  <h3 style={{ color:C.dorado }}>📈 Gráfica de Ganancias por Producto</h3>
  <div style={{ maxWidth:"700px", marginBottom:"30px", background:C.blanco,
                padding:"16px", borderRadius:"10px", border:`1px solid ${C.crema}` }}>
    <Bar data={dataGanancias} />
  </div>

  {/* STOCK BAJO */}
  <h3 style={{ color:C.rojo }}>⚠ Productos con Stock Bajo</h3>
  <table style={{ width:"100%", borderCollapse:"collapse" }}>
    <thead>
      <tr>
        <th style={{ ...thStyle, background:C.rojo }}>Producto</th>
        <th style={{ ...thStyle, background:C.rojo }}>Stock</th>
      </tr>
    </thead>
    <tbody>
      {stockBajo.length === 0 ?
        <tr><td colSpan="2" style={{ ...tdStyle, color:C.verde }}>
          ✅ Todo el inventario está bien
        </td></tr>
        :
        stockBajo.map((p,i)=>(
          <tr key={i} style={{ background:i%2===0 ? C.blanco : "#ffeaea" }}>
            <td style={tdStyle}>{p.nombre_producto}</td>
            <td style={{ ...tdStyle, color:C.rojo, fontWeight:"bold" }}>
              ⚠ {p.stock}
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>

</div>
);
}

export default Reportes;