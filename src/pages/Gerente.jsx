import {
  useEffect,
  useState,
} from 'react';

function Gerente() {

  const [totales, setTotales] = useState({});
  const [productos, setProductos] = useState([]);

  useEffect(() => {

    // 🔹 RESUMEN
    fetch("http://localhost/factufast-api/reportes/resumen.php")
      .then(res => res.json())
      .then(data => {
        setTotales(data.totales);
      })
      .catch(error => console.error(error));

    // 🔹 PRODUCTOS
    fetch("http://localhost/factufast-api/productos/listar.php")
      .then(res => res.json())
      .then(data => {
        setProductos(data);
      })
      .catch(error => console.error(error));

  }, []);

  return (

    <div className="gerente-container">

      <h2>Panel del Gerente</h2>
      <p>Bienvenido a FACTUSYS</p>

      {/* TARJETAS */}
      <div className="cards">

        <div className="card">
          <h3>Inventario</h3>
          <p>
            ${Number(totales.valor_inventario || 0).toLocaleString("es-CO")}
          </p>
        </div>

        <div className="card">
          <h3>Ganancia total</h3>
          <p>
            ${Number(totales.ganancia_total || 0).toLocaleString("es-CO")}
          </p>
        </div>

      </div>

      {/* PRODUCTOS */}
      <h3>Productos disponibles</h3>

      <table>

        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock mínimo</th>
          </tr>
        </thead>

        <tbody>

          {productos.length === 0 ? (

            <tr>
              <td colSpan="2">No hay productos registrados</td>
            </tr>

          ) : (

            productos.map((p, index) => (
              <tr key={index}>
                <td>{p.nombre_producto}</td>
                <td>{p.stock_minimo}</td>
              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Gerente;