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

function VentasMes(){

const [datos,setDatos]=useState([]);

useEffect(()=>{

fetch("http://localhost/factufast-api/reportes/ventas_mes.php")
.then(res=>res.json())
.then(data=>setDatos(data));

},[]);

const data={

labels:datos.map(d=>`Mes ${d.mes}`),

datasets:[
{
label:"Ventas por mes",
data:datos.map(d=>d.ventas)
}
]

};

return(

<div style={{width:"600px"}}>

<h3>Ventas por Mes</h3>

<Bar data={data}/>

</div>

);

}

export default VentasMes;