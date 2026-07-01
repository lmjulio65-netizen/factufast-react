import React, { useEffect, useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import './Listados.css';

function Inventario() {

  const [productos,setProductos] = useState([]);
  const [inventario,setInventario] = useState([]);
  const [historial,setHistorial] = useState([]);

  const [producto,setProducto] = useState("");
  const [cantidad,setCantidad] = useState("");
  const [tipo,setTipo] = useState("entrada");

  const [precioCompra,setPrecioCompra] = useState("");
  const [precioVenta,setPrecioVenta] = useState("");

  const [idMovimiento,setIdMovimiento] = useState(null);

  const [productoFiltro,setProductoFiltro] = useState("");
  const [fechaInicio,setFechaInicio] = useState("");
  const [fechaFin,setFechaFin] = useState("");
  const [busqueda,setBusqueda] = useState("");


  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol = usuario.rol || "";

  const esEmpleado = rol === "Empleado";
  const puedeModificar = !esEmpleado;



  useEffect(()=>{

    obtenerProductos();
    obtenerInventario();

  },[]);



  const obtenerProductos = ()=>{

    fetch("http://localhost/factufast-api/productos/listar.php")
    .then(res=>res.json())
    .then(data=>setProductos(data || []))
    .catch(()=>alert("Error al cargar productos"));

  };



  const obtenerInventario = ()=>{

    fetch(`http://localhost/factufast-api/inventario/listar.php?ts=${Date.now()}`)
    .then(res=>res.json())
    .then(data=>{

      setInventario(data.inventario || []);
      setHistorial(data.historial || []);

    })
    .catch(()=>alert("Error cargando inventario"));

  };



  const seleccionarProducto = (id)=>{

    setProducto(id);

    const prod = productos.find(
      p=>String(p.id_productos) === String(id)
    );


    if(prod){

      setPrecioCompra(
        prod.precio_compra ??
        prod.precio_entrada ??
        prod.precio_costo ??
        ""
      );


      setPrecioVenta(
        prod.precio_salida ??
        prod.precio_venta ??
        ""
      );

    }

  };




  const guardarMovimiento = (e)=>{

    e.preventDefault();

    if (!window.confirm("¿Estás seguro que deseas registrar este movimiento?")) return;


    if(!producto)
      return alert("Seleccione un producto");


    if(!cantidad || Number(cantidad)<=0)
      return alert("Cantidad inválida");



    fetch("http://localhost/factufast-api/inventario/guardar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },


      body:JSON.stringify({

        id_producto:producto,

        cantidad:cantidad,

        tipo_movimiento:"entrada",


        precio_entrada:precioCompra,

        precio_compra:precioCompra,


        precio_venta:precioVenta

      })


    })

    .then(res=>res.json())

    .then(()=>{

      alert("Entrada registrada");

      limpiarFormulario();

      obtenerInventario();

    })

    .catch(()=>alert("Error guardando movimiento"));

  };





  const editarMovimiento = (mov)=>{


    setIdMovimiento(mov.id_movimiento);

    setProducto(
      String(mov.id_producto ?? mov.id_productos)
    );


    setCantidad(mov.cantidad);


    setPrecioCompra(
      mov.precio_entrada ??
      mov.precio_compra ??
      ""
    );


    setPrecioVenta(
      mov.precio_venta ??
      mov.precio_salida ??
      ""
    );


  };





  const actualizarMovimiento = (e)=>{

    e.preventDefault();

    if (!window.confirm("¿Estás seguro que deseas actualizar este movimiento?")) return;


    fetch("http://localhost/factufast-api/inventario/editar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },


      body:JSON.stringify({

        id_movimiento:idMovimiento,

        id_producto:producto,

        cantidad:cantidad,


        tipo_movimiento:"entrada",


        precio_entrada:precioCompra,

        precio_compra:precioCompra,


        precio_venta:precioVenta

      })

    })


    .then(res=>res.json())

    .then(()=>{

      alert("Movimiento actualizado");

      limpiarFormulario();

      obtenerInventario();

    });

  };





  const eliminarMovimiento=(id)=>{


    if(!window.confirm("¿Eliminar movimiento?"))
      return;


    fetch("http://localhost/factufast-api/inventario/eliminar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },


      body:JSON.stringify({id})

    })

    .then(res=>res.json())

    .then(()=>obtenerInventario());

  };





  const buscarMovimientos=()=>{


    fetch("http://localhost/factufast-api/inventario/buscar.php",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },


      body:JSON.stringify({

        producto:productoFiltro,

        fecha_inicio:fechaInicio,

        fecha_fin:fechaFin

      })

    })


    .then(res=>res.json())

    .then(data=>setHistorial(data));

  };


  const limpiarFormulario=()=>{

    setProducto("");

    setCantidad("");

    setPrecioCompra("");

    setPrecioVenta("");

    setIdMovimiento(null);

  };
  const historialFiltrado = historial.filter((mov)=>{

  const texto = busqueda.toLowerCase();

  return (
    mov.nombre_producto?.toLowerCase().includes(texto) ||
    mov.tipo_movimiento?.toLowerCase().includes(texto)
  );

});

  const exportarExcel = async () => {

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Inventario");

  worksheet.columns = [
    { header: "Producto", key: "producto", width: 30 },
    { header: "Cantidad", key: "cantidad", width: 15 },
    { header: "Tipo", key: "tipo", width: 15 },
    { header: "Precio Compra", key: "compra", width: 20 },
    { header: "Precio Venta", key: "venta", width: 20 },
    { header: "Ganancia", key: "ganancia", width: 20 },
    { header: "Fecha", key: "fecha", width: 25 }
  ];
    worksheet.getRow(1).font = {
    bold:true
  };

  historial.forEach((mov) => {

    const compra = Number(
      mov.precio_entrada ??
      mov.precio_compra ??
      0
    );

    const venta = Number(
      mov.precio_venta ??
      0
    );

    const ganancia =
      (venta - compra) *
      Number(mov.cantidad);

    worksheet.addRow({
      producto: mov.nombre_producto,
      cantidad: mov.cantidad,
      tipo: mov.tipo_movimiento,
      compra,
      venta,
      ganancia,
      fecha: mov.fecha_movimiento
    });

  });
    const totalEntradas = historial
  .filter(m => m.tipo_movimiento === "entrada")
  .reduce(
    (total,m)=> total + Number(m.cantidad),
    0
  );


  const totalSalidas = historial
  .filter(m => m.tipo_movimiento === "salida")
  .reduce(
    (total,m)=> total + Number(m.cantidad),
    0
  );


  worksheet.addRow([]);


  worksheet.addRow({
    producto:"TOTAL ENTRADAS",
    cantidad:totalEntradas
  });


  worksheet.addRow({
    producto:"TOTAL SALIDAS",
    cantidad:totalSalidas
  });

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `Inventario_${new Date().toISOString().slice(0,10)}.xlsx`
  );

};





return(

<div className="container">


{puedeModificar && (

<>
<div
  style={{
    display:"flex",
    alignItems:"center",
    gap:"10px",
    marginBottom:"15px",
    flexWrap:"nowrap"
  }}
>

  <input
    type="date"
    value={fechaInicio}
    onChange={(e)=>setFechaInicio(e.target.value)}
    style={{
      width:"140px",
      padding:"8px"
    }}
  />


  <span>Hasta</span>


  <input
    type="date"
    value={fechaFin}
    onChange={(e)=>setFechaFin(e.target.value)}
    style={{
      width:"140px",
      padding:"8px"
    }}
  />


  <button
    onClick={buscarMovimientos}
    style={{
      padding:"8px 15px"
    }}
  >
    Buscar
  </button>


  <button
    onClick={exportarExcel}
    style={{
      padding:"8px 15px"
    }}
  >
    Descargar Excel
  </button>


</div>
<h2>
{ idMovimiento ? "Editar entrada":"Registrar entrada"}
</h2>


<form onSubmit={idMovimiento ? actualizarMovimiento : guardarMovimiento}>


<select
value={producto}
onChange={(e)=>seleccionarProducto(e.target.value)}
>

<option value="">
Seleccione producto
</option>


{productos.map(p=>(

<option
key={p.id_productos}
value={p.id_productos}
>

{p.nombre_producto}

</option>

))}


</select>



<input

type="number"

placeholder="Cantidad"

value={cantidad}

onChange={(e)=>setCantidad(e.target.value)}

/>



<button type="submit">

Guardar

</button>


</form>

</>

)}




<h2>Inventario Actual</h2>


<table>

<thead>

<tr>

<th>Producto</th>

<th>Stock Actual</th>

</tr>

</thead>


<tbody>


{inventario.map((prod,i)=>(

<tr key={i}>

<td>{prod.nombre_producto}</td>

<td>{prod.stock}</td>

</tr>

))}


</tbody>

</table>





<h2>Historial de Movimientos</h2>
<input

type="text"

placeholder="Buscar producto o movimiento..."

value={busqueda}

onChange={(e)=>setBusqueda(e.target.value)}

style={{
  width:"300px",
  padding:"8px",
  marginBottom:"15px"
}}

/>



<table>

<thead>

<tr>

<th>Producto</th>

<th>Cantidad</th>

<th>Tipo</th>

<th>Compra</th>

<th>Venta</th>

<th>Ganancia</th>

<th>Fecha</th>


{puedeModificar && <th>Acciones</th>}

</tr>

</thead>



<tbody>


{historialFiltrado.map((mov,i)=>{

const compra = Number(
mov.precio_entrada ??
mov.precio_compra ??
0
);


const venta = Number(
mov.precio_venta ??
0
);


const ganancia =
(venta-compra) *
Number(mov.cantidad);



return(

<tr key={i}>


<td>{mov.nombre_producto}</td>

<td>{mov.cantidad}</td>

<td>{mov.tipo_movimiento}</td>

<td>
${compra.toLocaleString("es-CO")}
</td>

<td>
${venta.toLocaleString("es-CO")}
</td>


<td>
${ganancia.toLocaleString("es-CO")}
</td>


<td>
{mov.fecha_movimiento}
</td>



{puedeModificar && (

<td>

<button onClick={()=>editarMovimiento(mov)}>
Editar
</button>


<button
className="btn-danger"
onClick={()=>eliminarMovimiento(mov.id_movimiento)}
>

Eliminar

</button>


</td>

)}


</tr>

)


})}


</tbody>


</table>


</div>

);

}


export default Inventario;