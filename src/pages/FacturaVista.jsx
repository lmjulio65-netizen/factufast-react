import './FacturaVista.css';

import React, {
  useEffect,
  useState,
} from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'react-router-dom';

import logo from '../assets/logo.png';

function FacturaVista() {

  const { id } = useParams();

  const [factura, setFactura] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const numeroFactura = `FAC-${String(id).padStart(4, "0")}`;

  useEffect(() => {

    fetch(`http://127.0.0.1/factufast-api/facturas/factura.php?id=${id}`)
      .then(res => res.json())
      .then(data => setFactura(data))
      .catch(err => {
        console.error(err);
        alert("Error cargando factura");
      });

    fetch(`http://127.0.0.1/factufast-api/facturas/detalle.php?id=${id}`)
      .then(res => res.json())
      .then(data => setDetalle(data.detalle || []))
      .catch(err => {
        console.error(err);
        alert("Error cargando detalle");
      });

  }, [id]);

  const imprimir = () => window.print();

  const descargarPDF = () => {
    const input = document.getElementById("factura");

    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`factura-${id}.pdf`);
    });
  };

  // 🔥 ENVIAR CORREO
  const enviarCorreo = async () => {
    if (!factura.correo_cliente) {
      alert("Este cliente no tiene correo registrado.");
      return;
    }

    const confirmar = window.confirm(
      `¿Enviar factura ${numeroFactura} al correo ${factura.correo_cliente}?`
    );
    if (!confirmar) return;

    setEnviando(true);

    const input = document.getElementById("factura");

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const pdfBase64 = pdf.output("datauristring").split(",")[1];

      const response = await fetch("http://127.0.0.1/factufast-api/facturas/enviar_correo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: factura.correo_cliente,
          nombre_cliente: factura.nombre_cliente,
          numero_factura: numeroFactura,
          pdf_base64: pdfBase64,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        alert(`✅ Factura enviada correctamente a ${factura.correo_cliente}`);
      } else {
        alert(`❌ Error al enviar: ${result.mensaje}`);
      }

    } catch (err) {
      console.error(err);
      alert("❌ Error generando o enviando el PDF");
    } finally {
      setEnviando(false);
    }
  };

  if (!factura) {
    return <h2>Cargando factura... (ID: {id})</h2>;
  }

  const getPrecio = (item) =>
    Number(item.precio_unitario || item.precio_venta || item.precio || 0);

  const subtotal = detalle.reduce(
    (acc, item) => acc + (getPrecio(item) * Number(item.cantidad)),
    0
  );

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <div id="factura" className="factura-container">

      {/* HEADER */}
      <div className="factura-header">

        <div style={{ display: "flex", gap: "10px" }}>
          <img src={logo} alt="logo" style={{ width: "70px" }} />

          <div>
            <h2 style={{ margin: 0 }}>FACTUFAST</h2>
            <p style={{ margin: 0 }}>NIT: 123456789-0</p>
            <p style={{ margin: 0 }}>Tel: 3024698432</p>
            <p style={{ margin: 0 }}>Maicao - La Guajira</p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h3>{numeroFactura}</h3>
          <p>{factura.fecha_emision}</p>
        </div>

      </div>

      <p style={{ fontSize: "12px" }}>
        Resolución XXX No. 123456789  
        Rango autorizado: 0001 - 5000
      </p>

      {/* CLIENTE */}
      <div className="factura-info">
        <p><b>Cliente:</b> {factura.nombre_cliente}</p>
        <p><b>Documento:</b> {factura.nit_cliente}</p>
        {factura.correo_cliente && (
          <p><b>Correo:</b> {factura.correo_cliente}</p>
        )}
      </div>

      <hr />

      {/* TABLA */}
      <table className="tabla-detalle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {detalle.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay productos
              </td>
            </tr>
          ) : (
            detalle.map((item, index) => {
              const precio = getPrecio(item);
              return (
                <tr key={index}>
                  <td>{item.nombre_producto}</td>
                  <td>{item.cantidad}</td>
                  <td>${precio.toLocaleString("es-CO")}</td>
                  <td>${(precio * item.cantidad).toLocaleString("es-CO")}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* TOTALES */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <h3>Subtotal: ${subtotal.toLocaleString("es-CO")}</h3>
        <h3>IVA (19%): ${iva.toLocaleString("es-CO")}</h3>
        <h2>Total: ${total.toLocaleString("es-CO")}</h2>
      </div>

      {/* QR */}
      <div style={{
        marginTop: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <p><b>Gracias por su compra</b></p>
          <p>FACTUFAST</p>
        </div>

        <QRCodeCanvas
          value={`http://localhost:3000/factura/${factura.id_factura}`}
          size={100}
        />
      </div>

      {/* FIRMA */}
      <div style={{ marginTop: "40px" }}>
        <p>___________________________</p>
        <p>Firma autorizada</p>
      </div>

      {/* FOOTER */}
      <hr />
      <p style={{ fontSize: "12px", textAlign: "center" }}>
        FACTUFAST © 2026 - Sistema de Facturación  
        <br />
        Luz Mery Julio - Monica Medina
      </p>

      {/* BOTONES */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={imprimir}>🖨 Imprimir</button>
        <button onClick={descargarPDF}>📄 Descargar PDF</button>

        {/* 🔥 Solo aparece si el cliente tiene correo */}
        {factura.correo_cliente ? (
          <button onClick={enviarCorreo} disabled={enviando}>
            {enviando ? "⏳ Enviando..." : "📧 Enviar por correo"}
          </button>
        ) : (
          <button disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            📧 Sin correo registrado
          </button>
        )}
      </div>

    </div>
  );
}

export default FacturaVista;