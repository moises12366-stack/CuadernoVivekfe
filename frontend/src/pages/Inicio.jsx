import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inicio.css";

export default function Inicio() {

    const navigate = useNavigate();

    const [hoy, setHoy] = useState({
        ventas: 0,
        gastos: 0,
        ganancia: 0
    });

    async function cargarResumen() {

        try {

            const respuesta = await fetch("http://localhost:3001/resumen/hoy");

            const datos = await respuesta.json();

            setHoy(datos);

        } catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        cargarResumen();

    }, []);

    return (

        <div className="contenedor">

            <div className="titulo">

                <h1>🌿 Vivekfe</h1>

                <p>Control diario del vivero</p>

            </div>

            <div className="fecha">

                <h3>📅 Hoy</h3>

                <p>{new Date().toLocaleDateString("es-CO")}</p>

            </div>

            <div className="card">

                <span>💰 Ventas del día</span>

                <h2>${Number(hoy.ventas).toLocaleString("es-CO")}</h2>

            </div>

            <div className="card">

                <span>💸 Gastos del día</span>

                <h2>${Number(hoy.gastos).toLocaleString("es-CO")}</h2>

            </div>

            <div className="card">

                <span>📈 Ganancia del día</span>

                <h2>${Number(hoy.ganancia).toLocaleString("es-CO")}</h2>

            </div>

            <button
                className="verde"
                onClick={() => navigate("/nueva-venta")}
            >
                ➕ Nueva Venta
            </button>

            <button
                className="rojo"
                onClick={() => navigate("/nuevo-gasto")}
            >
                💸 Nuevo Gasto
            </button>

            <button
                className="azul"
                onClick={() => navigate("/historial")}
            >
                📖 Historial
            </button>

            <button
                className="gris"
                onClick={() => navigate("/estadisticas")}
            >
                📊 Estadísticas
            </button>

            <button
                className="gris"
                onClick={() => navigate("/configuracion")}
            >
                ⚙ Configuración
            </button>

        </div>

    );

}