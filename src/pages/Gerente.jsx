import './Gerente.css';

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

    // 🔹 INVENTARIO REAL
    fetch("http://localhost/factufast-api/inventario/listar.php")
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          setProductos(data.inventario || data.productos || []);
        }

      })
      .catch(error => console.error(error));

  }, []);

  return (

    <div className="gerente-container">

      <h2>Panel del Gerente</h2>

      <p>
        Bienvenido a <strong>FACTUFAST</strong>
      </p>

      {/* TARJETAS */}
      <div className="resumen-container">

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

      </div>

      {/* PRODUCTOS */}
      <h3>Productos disponibles</h3>

      <table>

        <thead>

          <tr>

            <th>Nombre</th>

            <th>Stock</th>

          </tr>

        </thead>

        <tbody>

          {productos.length === 0 ? (

            <tr>

              <td colSpan="2">
                No hay productos registrados
              </td>

            </tr>

          ) : (

            productos.map((p, index) => (

              <tr key={index}>

                <td>
                  {p.nombre_producto}
                </td>

                <td>
                  {
                    p.cantidad ||
                    p.stock ||
                    p.stock_producto ||
                    p.existencias ||
                    0
                  }
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Gerente;