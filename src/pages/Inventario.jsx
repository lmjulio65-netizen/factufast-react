import React, {
  useEffect,
  useState,
} from 'react';

function Inventario(){

const [productos,setProductos]=useState([]);
const [inventario,setInventario]=useState([]);
const [historial,setHistorial]=useState([]);
const [producto,setProducto]=useState("");
const [cantidad,setCantidad]=useState("");
const [tipo,setTipo]=useState("entrada");
const [precioCompra,setPrecioCompra]=useState("");
const [precioVenta,setPrecioVenta]=useState("");
const [idMovimiento,setIdMovimiento]=useState(null);
const [productoFiltro,setProductoFiltro]=useState("");
const [fechaInicio,setFechaInicio]=useState("");
const [fechaFin,setFechaFin]=useState("");

// ✅ Leer rol
const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
const rol = usuario.rol || "";
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
      id_producto:producto, cantidad, tipo_movimiento:tipo,
      precio_compra:precioCompra, precio_venta:precioVenta
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
      id_movimiento:idMovimiento, cantidad,
      precio_entrada:precioCompra, precio_venta:precioVenta
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

    <button type="submit">
      {idMovimiento ? "Actualizar" : "Guardar"}
    </button>
  </form>

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
        {/* ✅ Columna acciones solo para gerente */}
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
          {/* ✅ Botones solo para gerente */}
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