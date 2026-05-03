import React, {
  useEffect,
  useState,
} from 'react';

function Productos(){

const [productos,setProductos]     = useState([]);
const [proveedores,setProveedores] = useState([]);
const [nombre,setNombre]           = useState("");
const [descripcion,setDescripcion] = useState("");
const [precio,setPrecio]           = useState("");
const [stock,setStock]             = useState("");
const [proveedor,setProveedor]     = useState("");
const [editando,setEditando]       = useState(false);
const [idProducto,setIdProducto]   = useState(null);
const [busqueda,setBusqueda]       = useState("");

// ✅ Leer rol
const usuarioObj = JSON.parse(localStorage.getItem("usuario") || "{}");
const rol        = usuarioObj.rol || "";
const esGerente  = rol === "Gerente 1";
const esAdmin    = rol === "Administrador";
const esEmpleado = rol === "Empleado";

useEffect(()=>{
  obtenerProductos();
  obtenerProveedores();
},[]);

const obtenerProductos = ()=>{
  fetch("http://localhost/factufast-api/productos/listar.php")
  .then(res=>res.json()).then(data=>setProductos(data));
};

const obtenerProveedores = ()=>{
  fetch("http://localhost/factufast-api/proveedores/listar.php")
  .then(res=>res.json()).then(data=>setProveedores(data));
};

const registrarProducto = (e)=>{
  e.preventDefault();
  if(!nombre || !precio || !proveedor){ alert("Complete los campos requeridos"); return; }
  fetch("http://localhost/factufast-api/productos/guardar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      nombre_producto:nombre, descripcion_producto:descripcion,
      precio_salida:precio, stock_minimo:stock, id_proveedor:proveedor
    })
  }).then(res=>res.json()).then(()=>{ obtenerProductos(); limpiarFormulario(); });
};

const eliminarProducto = (id)=>{
  if(!window.confirm("¿Eliminar producto?")) return;
  fetch(`http://localhost/factufast-api/productos/eliminar.php?id=${id}`)
  .then(res=>res.json()).then(()=>obtenerProductos());
};

const editarProducto = (prod)=>{
  setEditando(true);
  setIdProducto(prod.id_productos);
  setNombre(prod.nombre_producto);
  setDescripcion(prod.descripcion_producto);
  setPrecio(prod.precio_salida);
  setStock(prod.stock_minimo);
  setProveedor(prod.id_proveedor);
};

const actualizarProducto = (e)=>{
  e.preventDefault();
  fetch("http://localhost/factufast-api/productos/actualizar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      id_productos:idProducto, nombre_producto:nombre,
      descripcion_producto:descripcion, precio_salida:precio,
      stock_minimo:stock, id_proveedor:proveedor
    })
  }).then(res=>res.json()).then(()=>{ obtenerProductos(); limpiarFormulario(); });
};

const limpiarFormulario = ()=>{
  setNombre(""); setDescripcion(""); setPrecio("");
  setStock(""); setProveedor(""); setEditando(false); setIdProducto(null);
};

const productosFiltrados = productos.filter(prod=>
  prod.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
  prod.descripcion_producto?.toLowerCase().includes(busqueda.toLowerCase())
);

return(
<div className="gerente-container">
  <h2>Productos</h2>

  {/* ✅ FORMULARIO PARA TODOS — campos según rol */}
  <form onSubmit={editando ? actualizarProducto : registrarProducto}>

    {/* Nombre — todos */}
    <input
      placeholder="Nombre producto *"
      value={nombre}
      onChange={(e)=>setNombre(e.target.value)}
      required
    />

    {/* Descripción — todos */}
    <input
      placeholder="Descripción"
      value={descripcion}
      onChange={(e)=>setDescripcion(e.target.value)}
    />

    {/* Precio — gerente y admin */}
    {(esGerente || esAdmin) && (
      <input
        placeholder="Precio *"
        value={precio}
        onChange={(e)=>setPrecio(e.target.value)}
        required
      />
    )}

    {/* Stock — gerente y admin */}
    {(esGerente || esAdmin) && (
      <input
        placeholder="Stock"
        value={stock}
        onChange={(e)=>setStock(e.target.value)}
      />
    )}

    {/* Proveedor — todos */}
    <select value={proveedor} onChange={(e)=>setProveedor(e.target.value)} required>
      <option value="">Seleccione proveedor *</option>
      {proveedores.map((prov)=>(
        <option key={prov.id_proveedor} value={prov.id_proveedor}>
          {prov.nombre_proveedor}
        </option>
      ))}
    </select>

    {/* Nuevo proveedor — solo gerente */}
    {esGerente && (
      <button type="button"
        onClick={()=>window.location.href="/gerente/proveedores"}>
        + Nuevo proveedor
      </button>
    )}

    <button type="submit">
      {editando ? "Actualizar" : "Registrar producto"}
    </button>

    {editando && (
      <button type="button" onClick={limpiarFormulario}>
        Cancelar
      </button>
    )}

  </form>

  <br/>

  {/* ✅ Buscador para todos */}
  <input
    placeholder="🔍 Buscar producto por nombre o descripción"
    value={busqueda}
    onChange={(e)=>setBusqueda(e.target.value)}
    style={{ width:"100%", marginBottom:"10px", padding:"6px" }}
  />

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Proveedor</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {productosFiltrados.map((prod)=>(
        <tr key={prod.id_productos}>
          <td>{prod.id_productos}</td>
          <td>{prod.nombre_producto}</td>
          <td>{prod.descripcion_producto}</td>
          <td>{Number(prod.precio_salida).toLocaleString("es-CO")}</td>
          <td>{Number(prod.stock_minimo).toLocaleString("es-CO")}</td>
          <td>{prod.nombre_proveedor}</td>
          <td>
            {/* Editar — todos */}
            <button onClick={()=>editarProducto(prod)}>Editar</button>

            {/* Eliminar — solo gerente y admin */}
            {(esGerente || esAdmin) && (
              <button
                onClick={()=>eliminarProducto(prod.id_productos)}
                style={{ marginLeft:"5px", background:"#b71c1c", color:"white" }}>
                Eliminar
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

</div>
);
}

export default Productos;