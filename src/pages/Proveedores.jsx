import React, {
  useEffect,
  useState,
} from 'react';

function Proveedores(){

const [proveedores,setProveedores] = useState([]);

const [nit,setNit] = useState("");
const [nombre,setNombre] = useState("");
const [ciudad,setCiudad] = useState("");
const [direccion,setDireccion] = useState("");
const [correo,setCorreo] = useState("");
const [telefono,setTelefono] = useState("");

const [editando,setEditando] = useState(false);
const [idProveedor,setIdProveedor] = useState(null);

const [busqueda,setBusqueda] = useState("");

useEffect(()=>{
 obtenerProveedores();
},[]);


const obtenerProveedores = ()=>{

fetch("http://localhost/factufast-api/proveedores/listar.php")
.then(res=>res.json())
.then(data=>setProveedores(data));

};


const registrarProveedor = (e)=>{

e.preventDefault();

if(!nit || !nombre || !ciudad || !direccion || !correo || !telefono){
 alert("Todos los campos son obligatorios");
 return;
}

fetch("http://localhost/factufast-api/proveedores/guardar.php",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

NIT:nit,
nombre_proveedor:nombre,
ciudad_proveedor:ciudad,
direccion_proveedor:direccion,
correo_proveedor:correo,
telefono_proveedor:telefono

})

})
.then(res=>res.json())
.then(()=>{

obtenerProveedores();
limpiarFormulario();

});

};


const eliminarProveedor = (id)=>{

if(!window.confirm("¿Eliminar proveedor?")) return;

fetch(`http://localhost/factufast-api/proveedores/eliminar.php?id=${id}`)
.then(res=>res.json())
.then(()=>obtenerProveedores());

};


const editarProveedor = (prov)=>{

setEditando(true);

setIdProveedor(prov.id_proveedor);
setNit(prov.NIT);
setNombre(prov.nombre_proveedor);
setCiudad(prov.ciudad_proveedor);
setDireccion(prov.direccion_proveedor);
setCorreo(prov.correo_proveedor);
setTelefono(prov.telefono_proveedor);

};


const actualizarProveedor = (e)=>{

e.preventDefault();

fetch("http://localhost/factufast-api/proveedores/actualizar.php",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

id_proveedor:idProveedor,
NIT:nit,
nombre_proveedor:nombre,
ciudad_proveedor:ciudad,
direccion_proveedor:direccion,
correo_proveedor:correo,
telefono_proveedor:telefono

})

})
.then(res=>res.json())
.then(()=>{

obtenerProveedores();
limpiarFormulario();

});

};


const limpiarFormulario = ()=>{

setNit("");
setNombre("");
setCiudad("");
setDireccion("");
setCorreo("");
setTelefono("");

setEditando(false);
setIdProveedor(null);

};


const proveedoresFiltrados = proveedores.filter((prov)=>

prov.nombre_proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
prov.NIT.toLowerCase().includes(busqueda.toLowerCase()) ||
prov.ciudad_proveedor.toLowerCase().includes(busqueda.toLowerCase())

);


return(

<div className="gerente-container">

<h2>Proveedores</h2>

<form onSubmit={editando ? actualizarProveedor : registrarProveedor}>

<input
placeholder="NIT"
value={nit}
onChange={(e)=>setNit(e.target.value)}
/>

<input
placeholder="Nombre proveedor"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
/>

<input
placeholder="Ciudad"
value={ciudad}
onChange={(e)=>setCiudad(e.target.value)}
/>

<input
placeholder="Dirección"
value={direccion}
onChange={(e)=>setDireccion(e.target.value)}
/>

<input
placeholder="Correo"
value={correo}
onChange={(e)=>setCorreo(e.target.value)}
/>

<input
placeholder="Teléfono"
value={telefono}
onChange={(e)=>setTelefono(e.target.value)}
/>

<button type="submit">
{editando ? "Actualizar" : "Registrar"}
</button>

</form>

<br/>

<input
placeholder="Buscar proveedor por nombre, NIT o ciudad"
value={busqueda}
onChange={(e)=>setBusqueda(e.target.value)}
/>

<table>

<thead>

<tr>

<th>ID</th>
<th>NIT</th>
<th>Nombre</th>
<th>Ciudad</th>
<th>Dirección</th>
<th>Correo</th>
<th>Teléfono</th>
<th>Acciones</th>

</tr>

</thead>

<tbody>

{proveedoresFiltrados.map((prov)=>(

<tr key={prov.id_proveedor}>

<td>{prov.id_proveedor}</td>
<td>{prov.NIT}</td>
<td>{prov.nombre_proveedor}</td>
<td>{prov.ciudad_proveedor}</td>
<td>{prov.direccion_proveedor}</td>
<td>{prov.correo_proveedor}</td>
<td>{prov.telefono_proveedor}</td>

<td>

<button onClick={()=>editarProveedor(prov)}>
Editar
</button>

<button onClick={()=>eliminarProveedor(prov.id_proveedor)}>
Eliminar
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Proveedores;