import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

function ListadoFacturas() {

  const [facturas, setFacturas] = useState([]);
  const navigate = useNavigate();

  // ✅ Leer rol
  const usuarioObj = JSON.parse(localStorage.getItem("usuario") || "{}");
  const rol        = usuarioObj.rol || "";
  const esGerente  = rol === "Gerente 1";

  const listarFacturas = () => {
    fetch("http://127.0.0.1/factufast-api/facturas/listar.php")
      .then(res => res.json())
      .then(data => setFacturas(data))
      .catch(err => {
        console.error(err);
        alert("Error cargando facturas");
      });
  };

  useEffect(() => {
    listarFacturas();
  }, []);

  const eliminarFactura = async (id) => {
    if (!window.confirm("¿Eliminar esta factura?")) return;
    try {
      await fetch(`http://127.0.0.1/factufast-api/facturas/eliminar.php?id=${id}`);
      listarFacturas();
    } catch (error) {
      console.error(error);
      alert("Error eliminando factura");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>📊 LISTADO DE FACTURAS</h2>

      <table border="1" width="100%" style={{ textAlign: "center" }}>

        <thead style={{ background: "#8a7500", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {facturas.map((f, index) => (
            <tr key={index}>
              <td>{f.id_factura}</td>
              <td>{f.fecha_emision}</td>
              <td>{f.nombre_cliente}</td>
              <td>${Number(f.total).toLocaleString("es-CO")}</td>

              <td style={{ color: f.estado === "ANULADA" ? "red" : "green" }}>
                {f.estado || "ACTIVA"}
              </td>

              <td>
                {/* ✅ Ver — todos pueden */}
                <button onClick={() => navigate(`/factura/${f.id_factura}`)}>
                  👁 Ver
                </button>

                {/* ✅ Anular — solo gerente */}
                {esGerente && f.estado !== "ANULADA" && (
                  <button
                    onClick={() => navigate(`/factura/anular/${f.id_factura}`)}
                    style={{ backgroundColor: "red", color: "white", marginLeft: "5px" }}
                  >
                    ❌ Anular
                  </button>
                )}

                {/* ✅ Tachado ANULADA — todos ven el estado */}
                {f.estado === "ANULADA" && (
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    ANULADA
                  </span>
                )}

                {/* ✅ Eliminar — solo gerente */}
                {esGerente && (
                  <button
                    onClick={() => eliminarFactura(f.id_factura)}
                    style={{ marginLeft: "5px" }}
                  >
                    🗑 Eliminar
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

export default ListadoFacturas;