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

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function Reportes(){

const [totales,setTotales]=useState({});
const [ganancias,setGanancias]=useState([]);
const [stockBajo,setStockBajo]=useState([]);

useEffect(()=>{

fetch("http://localhost/factufast-api/reportes/resumen.php")
.then(res=>res.json())
.then(data=>{
setTotales(data.totales);
setGanancias(data.ganancias);
setStockBajo(data.stock_bajo);

});

},[]);



const dataGrafica = {

labels: ganancias.map(p=>p.nombre_producto),

datasets:[
{
label:"Ganancia por producto",

data: ganancias.map(p=>p.ganancia),

backgroundColor:"#b59b00"
}
]

};



return(

<div className="gerente-container">

<h2>Reportes del Negocio</h2>


<h3>Resumen General</h3>

<p>
<strong>Valor total inventario:</strong>
{" "}
${Number(totales.valor_inventario || 0).toLocaleString("es-CO")}
</p>

<p>
<strong>Ganancia total:</strong>
{" "}
${Number(totales.ganancia_total || 0).toLocaleString("es-CO")}
</p>



<h3>Ganancia por Producto</h3>

<table>

<thead>

<tr>
<th>Producto</th>
<th>Ganancia</th>
</tr>

</thead>

<tbody>

{ganancias.map((p,index)=>(

<tr key={index}>

<td>{p.nombre_producto}</td>

<td>
${Number(p.ganancia).toLocaleString("es-CO")}
</td>

</tr>

))}

</tbody>

</table>



<h3>Gráfica de Ganancias</h3>

<div style={{width:"600px"}}>

<Bar data={dataGrafica} />

</div>



<h3>⚠ Productos con Stock Bajo</h3>

<table>

<thead>

<tr>
<th>Producto</th>
<th>Stock</th>
</tr>

</thead>

<tbody>

{stockBajo.length===0 ?

<tr>
<td colSpan="2">Todo el inventario está bien</td>
</tr>

:

stockBajo.map((p,index)=>(

<tr key={index}>

<td>{p.nombre_producto}</td>

<td style={{color:"red"}}>
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