import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

function Facturas(){

  const navigate = useNavigate();

  const [productos,setProductos]         = useState([]);
  const [clientes,setClientes]           = useState([]);
  const [productosVenta,setProductosVenta] = useState([]);
  const [cliente,setCliente]             = useState("");
  const [clienteData,setClienteData]     = useState(null);
  const [usuarioSesion,setUsuarioSesion] = useState({ id: null, nombre: "" });

  // ✅ Leer rol
  const usuario  = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol      = usuario.rol || "";
  const esGerente = rol === "Gerente 1";

  useEffect(()=>{
    cargarProductos();
    cargarClientes();
    setUsuarioSesion({
      id:     usuario.id     || null,
      nombre: usuario.nombre || ""
    });
  },[]);

  const cargarProductos = async()=>{
    const res  = await fetch("http://localhost/factufast-api/inventario/listar.php");
    const data = await res.json();
    setProductos(data.inventario || []);
  };

  const cargarClientes = async()=>{
    const res  = await fetch("http://localhost/factufast-api/clientes/listar.php");
    const data = await res.json();
    setClientes(data || []);
  };

  const formato = (num) => Number(num || 0).toLocaleString("es-CO");

  const agregarProducto=(id)=>{
    if(!id) return;
    const prod = productos.find(p=>p.id_productos == id);
    if(!prod) return;
    if(prod.stock <= 0){ alert("Producto sin stock"); return; }
    const existe = productosVenta.find(p=>p.id_productos == id);
    if(existe){ alert("Producto ya agregado"); return; }
    setProductosVenta([...productosVenta, {
      id_productos:    prod.id_productos,
      nombre_producto: prod.nombre_producto,
      precio:          Number(prod.precio_venta),
      iva:             Number(prod.iva || 0),
      stock:           Number(prod.stock),
      cantidad:        1,
      subtotal:        Number(prod.precio_venta)
    }]);
  };

  const cambiarCantidad=(id,cantidad)=>{
    setProductosVenta(productosVenta.map(p=>{
      if(p.id_productos == id){
        if(cantidad <= 0)    return { ...p, cantidad:1, subtotal:p.precio };
        if(cantidad > p.stock){ alert("Stock insuficiente"); return p; }
        return { ...p, cantidad, subtotal: cantidad * p.precio };
      }
      return p;
    }));
  };

  const eliminarProductoVenta=(id)=>{
    setProductosVenta(productosVenta.filter(p=>p.id_productos !== id));
  };

  const calcularSubtotal = () => productosVenta.reduce((t,p)=> t + p.subtotal, 0);
  const calcularIVA      = () => productosVenta.reduce((t,p)=> t + (p.subtotal * p.iva), 0);
  const totalFinal       = () => calcularSubtotal() + calcularIVA();

  const guardarFactura = async()=>{
    if(!usuarioSesion.id)          { alert("Usuario no válido");    return; }
    if(!cliente)                   { alert("Seleccione cliente");   return; }
    if(productosVenta.length === 0){ alert("Agregue productos");    return; }

    const factura = {
      cliente:    Number(cliente),
      id_usuario: usuarioSesion.id,
      subtotal:   calcularSubtotal(),
      iva:        calcularIVA(),
      total:      totalFinal(),
      productos:  productosVenta.map(p=>({
        id_producto: p.id_productos,
        cantidad:    p.cantidad,
        precio:      p.precio,
        iva:         p.iva,
        subtotal:    p.subtotal
      }))
    };

    try{
      const res  = await fetch("http://localhost/factufast-api/facturas/guardar.php",{
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify(factura)
      });
      const data = await res.json();
      if(data.success){
        navigate(`/factura/${data.id_factura}`);
        setProductosVenta([]);
        setCliente("");
        setClienteData(null);
      } else {
        alert("Error guardando factura");
      }
    } catch(err){
      console.error(err);
      alert("Error servidor");
    }
  };

  return(
    <div className="gerente-container">

      <h2>FACTURACIÓN</h2>
      <p><b>Usuario:</b> {usuarioSesion.nombre}</p>

      {/* CLIENTE */}
      <select value={cliente} onChange={(e)=>{
        const id = e.target.value;
        setCliente(id);
        setClienteData(clientes.find(c=>c.id_cliente == id));
      }}>
        <option value="">Seleccione cliente</option>
        {clientes.map(c=>(
          <option key={c.id_cliente} value={c.id_cliente}>
            {c.nombre_cliente}
          </option>
        ))}
      </select>

      {clienteData && (
        <div>
          <p>Documento: {clienteData.nit_cliente}</p>
          <p>Teléfono:  {clienteData.telefono_cliente}</p>
        </div>
      )}

      <h3>Agregar producto</h3>
      <select onChange={(e)=>agregarProducto(e.target.value)}>
        <option value="">Seleccione producto</option>
        {productos.map(p=>(
          <option key={p.id_productos} value={p.id_productos}>
            {p.nombre_producto} - ${formato(p.precio_venta)}
          </option>
        ))}
      </select>

      <table border="1">
        <thead>
          <tr>
            <th>Producto</th><th>Precio</th>
            <th>Cantidad</th><th>Subtotal</th><th></th>
          </tr>
        </thead>
        <tbody>
          {productosVenta.map((p,i)=>(
            <tr key={i}>
              <td>{p.nombre_producto}</td>
              <td>${formato(p.precio)}</td>
              <td>
                <input type="number" value={p.cantidad}
                  onChange={(e)=>cambiarCantidad(p.id_productos, Number(e.target.value))}
                />
              </td>
              <td>${formato(p.subtotal)}</td>
              <td>
                <button onClick={()=>eliminarProductoVenta(p.id_productos)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Subtotal: ${formato(calcularSubtotal())}</h4>
      <h4>IVA:      ${formato(calcularIVA())}</h4>
      <h3>Total:    ${formato(totalFinal())}</h3>

      <button onClick={guardarFactura}>Generar Factura</button>

      {/* ✅ Listado de facturas solo para gerente y admin */}
      {esGerente && (
        <div style={{ marginTop:"20px" }}>
          <button onClick={()=>navigate("/gerente/listado-facturas")}>
            📊 Ver listado de facturas
          </button>
        </div>
      )}

    </div>
  );
}

export default Facturas;