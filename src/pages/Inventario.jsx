import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import * as XLSX from 'xlsx';

function Inventario(){

const [productos,setProductos]           = useState([]);
const [inventario,setInventario]         = useState([]);
const [historial,setHistorial]           = useState([]);
const [producto,setProducto]             = useState("");
const [cantidad,setCantidad]             = useState("");
const [tipo,setTipo]                     = useState("entrada");
const [precioCompra,setPrecioCompra]     = useState("");
const [precioVenta,setPrecioVenta]       = useState("");
const [idMovimiento,setIdMovimiento]     = useState(null);
const [productoFiltro,setProductoFiltro] = useState("");
const [fechaInicio,setFechaInicio]       = useState("");
const [fechaFin,setFechaFin]             = useState("");
const [fechaExportInicio,setFechaExportInicio] = useState("");
const [fechaExportFin,setFechaExportFin]       = useState("");
// ✅ Fecha del movimiento
const [fechaMovimiento,setFechaMovimiento] = useState(
  new Date().toISOString().split("T")[0]
);

const importRef = useRef();

const usuario   = JSON.parse(localStorage.getItem("usuario") || "{}");
const rol       = usuario.rol || "";
const esGerente = rol === "Gerente 1";

useEffect(()=>{
  fetch("http://localhost/factufast-api/productos/listar.php")
  .then(res=>res.json()).then(data=>setProductos(data));
  obtenerInventario();
},[]);

const obtenerInventario=()=>{
  fetch("http://localhost/factufast-api/inventario/listar.php")
  .then(res=>res.json()).then(data=>{
    setInventario(data.inventario);
    setHistorial(data.historial);
  });
};

const seleccionarProducto=(id)=>{
  setProducto(id);
  const prod=productos.find(p=>p.id_productos==id);
  if(prod) setPrecioVenta(prod.precio_salida);
};

const guardarMovimiento=(e)=>{
  e.preventDefault();
  fetch("http://localhost/factufast-api/inventario/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      id_producto:      producto,
      cantidad,
      tipo_movimiento:  tipo,
      precio_compra:    precioCompra,
      precio_venta:     precioVenta,
      fecha_movimiento: fechaMovimiento  // ✅
    })
  }).then(res=>res.json()).then(()=>{
    alert("Movimiento registrado");
    limpiarFormulario();
    obtenerInventario();
  }).catch(()=>alert("Error conectando con el servidor"));
};

const actualizarMovimiento=(e)=>{
  e.preventDefault();
  fetch("http://localhost/factufast-api/inventario/editar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      id_movimiento:    idMovimiento,
      cantidad,
      precio_entrada:   precioCompra,
      precio_venta:     precioVenta,
      fecha_movimiento: fechaMovimiento  // ✅
    })
  }).then(res=>res.json()).then(()=>{
    alert("Movimiento actualizado");
    limpiarFormulario();
    obtenerInventario();
  });
};

const editarMovimiento=(mov)=>{
  setIdMovimiento(mov.id_movimiento);
  setProducto(String(mov.id_productos));
  setCantidad(mov.cantidad);
  setTipo(mov.tipo_movimiento);
  setPrecioCompra(mov.precio_entrada);
  setPrecioVenta(mov.precio_venta);
  // ✅ Cargar fecha existente al editar
  setFechaMovimiento(mov.fecha_movimiento
    ? mov.fecha_movimiento.split(" ")[0]  // por si viene con hora
    : new Date().toISOString().split("T")[0]
  );
};

const eliminarMovimiento=(id)=>{
  if(!window.confirm("¿Eliminar movimiento?")) return;
  fetch(`http://localhost/factufast-api/inventario/eliminar.php?id=${id}`)
  .then(res=>res.json()).then(()=>obtenerInventario());
};

const buscarMovimientos=()=>{
  fetch("http://localhost/factufast-api/inventario/buscar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      producto:productoFiltro, fecha_inicio:fechaInicio, fecha_fin:fechaFin
    })
  }).then(res=>res.json()).then(data=>setHistorial(data));
};

const limpiarFormulario=()=>{
  setProducto(""); setCantidad(""); setPrecioCompra("");
  setPrecioVenta(""); setIdMovimiento(null);
  setFechaMovimiento(new Date().toISOString().split("T")[0]);
};

const descargarPlantilla = () => {
  const columnas = [{ 
    nombre_producto:"Ejemplo producto", cantidad:1,
    tipo_movimiento:"entrada", precio_entrada:50000,
    precio_venta:80000, fecha_movimiento:"2026-01-15"
  }];
  const ws = XLSX.utils.json_to_sheet(columnas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
  XLSX.writeFile(wb, "plantilla_movimientos.xlsx");
};

const exportarDatos = async () => {
  const res  = await fetch("http://localhost/factufast-api/inventario/exportar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      plantilla: false,
      fecha_inicio: fechaExportInicio,
      fecha_fin:    fechaExportFin
    })
  });
  const data = await res.json();
  if (!data.filas.length) { alert("No hay datos en ese rango"); return; }
  const ws = XLSX.utils.json_to_sheet(data.filas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
  XLSX.writeFile(wb, `movimientos_${fechaExportInicio||"todo"}_${fechaExportFin||"todo"}.xlsx`);
};

const importarExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const wb    = XLSX.read(evt.target.result, { type:"binary", cellDates:true });
    const ws    = wb.Sheets[wb.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(ws, { dateNF:"yyyy-mm-dd" });

    // ✅ Convertir fechas correctamente
    const filasLimpias = filas.map(f => ({
      ...f,
      fecha_movimiento: f.fecha_movimiento instanceof Date
        ? f.fecha_movimiento.toISOString().split("T")[0]
        : String(f.fecha_movimiento).substring(0,10)
    }));

    if (!filasLimpias.length) { alert("El archivo está vacío"); return; }
    const confirmar = window.confirm(`¿Importar ${filasLimpias.length} movimientos?`);
    if (!confirmar) return;

    const res  = await fetch("http://localhost/factufast-api/inventario/importar.php",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ filas: filasLimpias })
    });
    const data = await res.json();
    alert(`✅ Importados: ${data.insertados} | ❌ Errores: ${data.errores}`);
    obtenerInventario();
  };
  reader.readAsBinaryString(file);
  e.target.value = "";
};

return(
<div className="gerente-container">

  <h2>Registrar Movimiento</h2>

  <form onSubmit={idMovimiento ? actualizarMovimiento : guardarMovimiento}>
    <select value={producto} onChange={(e)=>seleccionarProducto(e.target.value)}>
      <option value="">Producto</option>
      {productos.map((prod)=>(
        <option key={prod.id_productos} value={prod.id_productos}>
          {prod.nombre_producto}
        </option>
      ))}
    </select>

    <input placeholder="Cantidad" value={cantidad}
      onChange={(e)=>setCantidad(e.target.value)} />

    <select value={tipo} onChange={(e)=>setTipo(e.target.value)}>
      <option value="entrada">Entrada</option>
      <option value="salida">Salida</option>
    </select>

    <input placeholder="Precio compra" value={precioCompra}
      onChange={(e)=>setPrecioCompra(e.target.value)} />

    <input placeholder="Precio venta" value={precioVenta}
      onChange={(e)=>setPrecioVenta(e.target.value)} />

    {/* ✅ CAMPO FECHA */}
    <label style={{ fontSize:"13px", color:"#555" }}>Fecha del movimiento:</label>
    <input
      type="date"
      value={fechaMovimiento}
      onChange={(e)=>setFechaMovimiento(e.target.value)}
    />

    <button type="submit">
      {idMovimiento ? "Actualizar" : "Guardar"}
    </button>

    {idMovimiento && (
      <button type="button" onClick={limpiarFormulario}
        style={{ marginLeft:"8px", background:"#666", color:"white",
                 border:"none", padding:"8px 14px", borderRadius:"6px",
                 cursor:"pointer" }}>
        Cancelar
      </button>
    )}
  </form>

  {/* SECCIÓN EXCEL */}
  {esGerente && (
    <div style={{ margin:"20px 0", padding:"15px",
                  background:"#f5f5f5", borderRadius:"8px" }}>
      <h3>📊 Excel - Importar / Exportar</h3>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={descargarPlantilla}
          style={{ background:"#C9BD86", color:"black", padding:"8px 14px" }}>
          📥 Descargar Plantilla
        </button>
        <button onClick={()=>importRef.current.click()}
          style={{ background:"#8A7700", color:"white", padding:"8px 14px" }}>
          📂 Importar Excel
        </button>
        <input ref={importRef} type="file" accept=".xlsx,.xls"
          style={{ display:"none" }} onChange={importarExcel} />
        <input type="date" value={fechaExportInicio}
          onChange={(e)=>setFechaExportInicio(e.target.value)} />
        <input type="date" value={fechaExportFin}
          onChange={(e)=>setFechaExportFin(e.target.value)} />
        <button onClick={exportarDatos}
          style={{ background:"#C9BD86", color:"black", padding:"8px 14px" }}>
          📤 Exportar datos
        </button>
      </div>
      <p style={{ fontSize:"12px", color:"#666", marginTop:"8px" }}>
        💡 Descarga la plantilla, llénala y usa "Importar Excel" para cargar movimientos antiguos
      </p>
    </div>
  )}

  <h2>Inventario Actual</h2>
  <table>
    <thead>
      <tr>
        <th>Producto</th><th>Stock</th>
        <th>Precio venta</th><th>Valor inventario</th>
      </tr>
    </thead>
    <tbody>
      {inventario.map((prod,index)=>(
        <tr key={index}>
          <td>{prod.nombre_producto}</td>
          <td>{prod.stock}</td>
          <td>${Number(prod.precio_venta).toLocaleString("es-CO")}</td>
          <td>${Number(prod.valor_inventario).toLocaleString("es-CO")}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <h3>Buscar Movimientos</h3>
  <select value={productoFiltro} onChange={(e)=>setProductoFiltro(e.target.value)}>
    <option value="">Todos los productos</option>
    {productos.map(p=>(
      <option key={p.id_productos} value={p.id_productos}>{p.nombre_producto}</option>
    ))}
  </select>
  <input type="date" value={fechaInicio} onChange={(e)=>setFechaInicio(e.target.value)} />
  <input type="date" value={fechaFin} onChange={(e)=>setFechaFin(e.target.value)} />
  <button onClick={buscarMovimientos}>Buscar</button>
  <button onClick={obtenerInventario}>Mostrar Todo</button>

  <h2>Historial de Movimientos</h2>
  <table>
    <thead>
      <tr>
        <th>Producto</th><th>Cantidad</th><th>Tipo</th>
        <th>Compra</th><th>Venta</th><th>Ganancia</th>
        <th>Fecha</th>
        {esGerente && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {historial.map((mov,index)=>(
        <tr key={index}>
          <td>{mov.nombre_producto}</td>
          <td>{mov.cantidad}</td>
          <td>{mov.tipo_movimiento}</td>
          <td>${Number(mov.precio_entrada).toLocaleString("es-CO")}</td>
          <td>${Number(mov.precio_venta).toLocaleString("es-CO")}</td>
          <td>${Number(mov.ganancia).toLocaleString("es-CO")}</td>
          <td>{mov.fecha_movimiento}</td>
          {esGerente && (
            <td>
              <button onClick={()=>editarMovimiento(mov)}>Editar</button>
              <button onClick={()=>eliminarMovimiento(mov.id_movimiento)}>Eliminar</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>

</div>
);
}

export default Inventario;