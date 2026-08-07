import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Estadisticas() {

    const navigate = useNavigate();

    const [hoy, setHoy] = useState({
        ventas: 0,
        gastos: 0,
        ganancia: 0
    });

    const [semana, setSemana] = useState({
        ventas: 0,
        gastos: 0,
        ganancia: 0
    });

    const [datos, setDatos] = useState({
        ventasMes: 0,
        gastosMes: 0,
        gananciaMes: 0,
        numeroVentas: 0,
        numeroGastos: 0,
        promedioVenta: 0,
        codigoMasVendido: "-",
        cantidadMayor: 0,
        codigoMasDinero: "-",
        dineroMayor: 0
    });

    async function cargar() {

        try {

            const [rHoy, rSemana, rDatos] = await Promise.all([

                fetch("https://vivekfe-backend.onrender.com/resumen/hoy"),

                fetch("https://vivekfe-backend.onrender.com/resumen/semana"),

                fetch("https://vivekfe-backend.onrender.com/estadisticas")

            ]);

            setHoy(await rHoy.json());

            setSemana(await rSemana.json());

            setDatos(await rDatos.json());

        } catch (error) {

            console.log(error);

        }

    }

    useEffect(() => {

        cargar();

    }, []);

    function tarjeta(titulo, ventas, gastos, ganancia) {

        return (

            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #ddd"
                }}
            >

                <h2>{titulo}</h2>

                <p>
                    <strong>💰 Ventas</strong><br />
                    ${Number(ventas).toLocaleString("es-CO")}
                </p>

                <p>
                    <strong>💸 Gastos</strong><br />
                    ${Number(gastos).toLocaleString("es-CO")}
                </p>

                <p>
                    <strong>📈 Ganancia</strong><br />
                    ${Number(ganancia).toLocaleString("es-CO")}
                </p>

            </div>

        );

    }

    return (

        <div
            style={{
                maxWidth: "700px",
                margin: "auto",
                padding: "20px"
            }}
        >

            <h1>📊 Estadísticas</h1>

            {tarjeta(
                "📅 Hoy",
                hoy.ventas,
                hoy.gastos,
                hoy.ganancia
            )}

            {tarjeta(
                "📆 Semana",
                semana.ventas,
                semana.gastos,
                semana.ganancia
            )}

            {tarjeta(
                "🗓 Mes",
                datos.ventasMes,
                datos.gastosMes,
                datos.gananciaMes
            )}
                        <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "15px",
                    border: "1px solid #ddd"
                }}
            >

                <h2>📈 Información del mes</h2>

                <p>

                    <strong>🧾 Ventas realizadas</strong>

                    <br />

                    {datos.numeroVentas}

                </p>

                <p>

                    <strong>💸 Gastos registrados</strong>

                    <br />

                    {datos.numeroGastos}

                </p>

                <p>

                    <strong>💵 Venta promedio</strong>

                    <br />

                    ${Number(datos.promedioVenta).toLocaleString("es-CO")}

                </p>

                <p>

                    <strong>🏆 Código más vendido</strong>

                    <br />

                    {datos.codigoMasVendido} ({datos.cantidadMayor} ventas)

                </p>

                <p>

                    <strong>💰 Código que más dinero produjo</strong>

                    <br />

                    {datos.codigoMasDinero}

                </p>

                <p>

                    <strong>Total vendido por ese código</strong>

                    <br />

                    ${Number(datos.dineroMayor).toLocaleString("es-CO")}

                </p>

                <button

                    onClick={() => navigate("/meses")}

                    style={{

                        width: "100%",

                        marginTop: "20px",

                        padding: "12px",

                        background: "#1976d2",

                        color: "white",

                        border: "none",

                        borderRadius: "8px",

                        cursor: "pointer"

                    }}

                >

                    📅 Consultar meses anteriores

                </button>

            </div>
                        <button

                onClick={() => navigate("/")}

                style={{

                    width: "100%",

                    padding: "15px",

                    background: "#2e7d32",

                    color: "white",

                    border: "none",

                    borderRadius: "10px",

                    cursor: "pointer",

                    fontSize: "16px"

                }}

            >

                ⬅ Volver

            </button>

        </div>

    );

}