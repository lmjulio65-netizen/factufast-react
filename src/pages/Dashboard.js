import React, {
  useEffect,
  useState,
} from 'react';

function Dashboard(){

const [data,setData]=useState({});

useEffect(()=>{

fetch("http://localhost/factufast-api/reportes/dashboard.php")

.then(res=>res.json())

.then(data=>setData(data));

},[]);


return(

<div className="gerente-container">

<h2>Dashboard FACTUFAST</h2>

<div style={{display:"flex",gap:"40px"}}>

<div>

<h3>Ventas del mes</h3>

<p>

${Number(data.ventas_mes?.ventas_mes || 0).toLocaleString("es-CO")}

</p>

</div>


<div>

<h3>Ganancia del mes</h3>

<p>

${Number(data.ganancia_mes?.ganancia_mes || 0).toLocaleString("es-CO")}

</p>

</div>


<div>

<h3>Valor inventario</h3>

<p>

${Number(data.inventario?.valor_inventario || 0).toLocaleString("es-CO")}

</p>

</div>

</div>


<h3>Productos más vendidos</h3>

<table>

<thead>

<tr>

<th>Producto</th>
<th>Vendidos</th>

</tr>

</thead>

<tbody>

{data.productos?.map((prod,index)=>(

<tr key={index}>

<td>{prod.nombre_producto}</td>
<td>{prod.vendidos}</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Dashboard;