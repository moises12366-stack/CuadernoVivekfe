import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Historial() {

    const navigate = useNavigate();

    const [datos, setDatos] = useState([]);
    const [fechaBuscar, setFechaBuscar] = useState("");

    async function cargar(fecha = "") {

        const ruta = fecha
            ? `http://localhost:3001/historial/${fecha}`
            : "http://localhost:3001/historial";

        const respuesta = await fetch(ruta);

        const historial = await respuesta.json();

        setDatos(historial);

    }

    useEffect(() => {

        cargar();

    }, []);

    async function eliminar(item) {

        const ruta =
            item.tipo === "venta"
                ? `http://localhost:3001/ventas/${item.id}`
                : `http://localhost:3001/gastos/${item.id}`;

        const texto =
            item.tipo === "venta"
                ? "¿Eliminar esta venta?"
                : "¿Eliminar este gasto?";

        if (!window.confirm(texto)) return;

        await fetch(ruta, {
            method: "DELETE"
        });

        cargar(fechaBuscar);

    }

    function hoy() {

        const ahora = new Date();

        const año = ahora.getFullYear();

        const mes = String(ahora.getMonth() + 1).padStart(2, "0");

        const dia = String(ahora.getDate()).padStart(2, "0");

        const fecha = `${año}-${mes}-${dia}`;

        setFechaBuscar(fecha);

        cargar(fecha);

    }

    return (

        <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>

            <h1>📖 Historial</h1>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}
            >

                <input
                    type="date"
                    value={fechaBuscar}
                    onChange={(e) => setFechaBuscar(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px"
                    }}
                />

                <button
                    onClick={() => cargar(fechaBuscar)}
                    style={{
                        background: "#2e7d32",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    🔍 Buscar
                </button>

                <button
                    onClick={hoy}
                    style={{
                        background: "#1976d2",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    📅 Hoy
                </button>

                <button
                    onClick={() => {

                        setFechaBuscar("");

                        cargar();

                    }}
                    style={{
                        background: "#757575",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    📋 Ver todo
                </button>

            </div>

            {datos.length === 0 && (
                <p>No hay registros.</p>
            )}

            {datos.map((item) => (

                <div
                    key={item.tipo + item.id}
                    style={{
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "12px"
                    }}
                >

                    <h3>

                        {item.tipo === "venta"
                            ? "💰 Venta"
                            : "💸 Gasto"}

                    </h3>

                    <p>

                        <strong>

                            {item.tipo === "venta"
                                ? "Código"
                                : "Descripción"}

                        </strong>

                        <br />

                        {item.codigo}

                    </p>

                    <p>

                        <strong>Valor</strong>

                        <br />

                        ${Number(item.valor).toLocaleString("es-CO")}

                    </p>

                    {item.tipo === "venta" && (

                        <p>

                            <strong>Pago</strong>

                            <br />

                            {item.pago}

                        </p>

                    )}

                    <p>

                        {item.fecha}

                        <br />

                        {item.hora}

                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px"
                        }}
                    >

                        <button
                            onClick={() => navigate(`/editar/${item.tipo}/${item.id}`)}
                            style={{
                                background: "#1976d2",
                                color: "white",
                                border: "none",
                                padding: "10px",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            ✏ Editar
                        </button>

                        <button
                            onClick={() => eliminar(item)}
                            style={{
                                background: "#d32f2f",
                                color: "white",
                                border: "none",
                                padding: "10px",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            🗑 Eliminar
                        </button>

                    </div>

                </div>

            ))}

        </div>

    );

}