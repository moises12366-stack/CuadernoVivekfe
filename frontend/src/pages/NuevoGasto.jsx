import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NuevaVenta.css";

export default function NuevoGasto() {

  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");

  async function guardarGasto() {

    if (descripcion.trim() === "") {
      alert("Escribe una descripción.");
      return;
    }

    if (valor === "" || Number(valor) <= 0) {
      alert("Escribe un valor válido.");
      return;
    }

    try {

      const respuesta = await fetch("http://localhost:3001/gastos", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          descripcion,
          valor
        })

      });

      if (!respuesta.ok) {
        throw new Error();
      }

      alert("Gasto guardado correctamente.");

      navigate("/");

    } catch {

      alert("Error al guardar el gasto.");

    }

  }

  return (

    <div className="contenedor">

      <h1>💸 Nuevo Gasto</h1>

      <label>Descripción</label>

      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Ej: Compra de materas"
      />

      <label>Valor</label>

      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="0"
      />

      <button
        className="guardar"
        onClick={guardarGasto}
      >
        Guardar Gasto
      </button>

      <button
        className="volver"
        onClick={() => navigate("/")}
      >
        ← Volver
      </button>

    </div>

  );

}