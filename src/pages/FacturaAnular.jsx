import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

function FacturaAnular() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [factura, setFactura] = useState(null);
  const [detalle, setDetalle] = useState([]);

  const cargarFactura = () => {
    fetch(`http://localhost/factufast-api/facturas/detalle.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setFactura(data.factura || {});
        setDetalle(data.detalle || []);
      })
      .catch(() => {
        alert("Error cargando factura");
      });
  };

  useEffect(() => {
    cargarFactura();
  }, [id]);

  // 🧮 CALCULOS — usa precio_unitario y el iva de cada producto
  const subtotal = detalle.reduce(
    (acc, item) => acc + (Number(item.precio_unitario || 0) * Number(item.cantidad || 0)),
    0
  );

  const iva = detalle.reduce(
    (acc, item) => acc + (Number(item.precio_unitario || 0) * Number(item.cantidad || 0) * Number(item.iva || 0)),
    0
  );

  const total = subtotal + iva;

  // ❌ ANULAR FACTURA
  const anularFactura = async () => {

    if (factura.estado === "ANULADA") {
      alert("Esta factura ya está anulada");
      return;
    }

    const confirmar = window.confirm("¿Seguro que deseas anular esta factura?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost/factufast-api/facturas/anular.php?id=${id}`);
      const data = await res.json();

      if (data.success) {
        setFactura({ ...factura, estado: "ANULADA" });
        alert("Factura anulada correctamente");
        setTimeout(() => {
          navigate("/facturas");
        }, 1000);
      } else {
        alert("No se pudo anular");
      }

    } catch (error) {
      console.error(error);
      alert("Error al anular factura");
    }
  };

  if (!factura) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "30px" }}>

      <h2>❌ Anular factura #{factura.id_factura}</h2>

      <p><b>Cliente:</b> {factura.nombre_cliente}</p>

      <p>
        <b>Estado:</b>{" "}
        <span style={{
          color: factura.estado === "ANULADA" ? "red" : "green",
          fontWeight: "bold"
        }}>
          {factura.estado || "ACTIVA"}
        </span>
      </p>

      <table border="1" width="100%" style={{ marginTop: "20px" }}>
        <thead style={{ background: "#8a7500", color: "white" }}>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {detalle.length > 0 ? (
            detalle.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre_producto}</td>
                <td>{item.cantidad}</td>
                <td>${Number(item.precio_unitario || 0).toLocaleString("es-CO")}</td>
                <td>${Number(item.subtotal || 0).toLocaleString("es-CO")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay productos</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Subtotal: ${subtotal.toLocaleString("es-CO")}</h3>
      <h3>IVA: ${iva.toLocaleString("es-CO")}</h3>
      <h2>Total: ${total.toLocaleString("es-CO")}</h2>

      {factura.estado !== "ANULADA" ? (
        <button
          onClick={anularFactura}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          ❌ Anular factura
        </button>
      ) : (
        <p style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>
          ⚠️ Esta factura ya fue anulada
        </p>
      )}

    </div>
  );
}

export default FacturaAnular;