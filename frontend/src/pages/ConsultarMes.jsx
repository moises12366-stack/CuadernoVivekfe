import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultarMes() {

    const navigate = useNavigate();

    const [mes, setMes] = useState(new Date().getMonth() + 1);

    const [año, setAño] = useState(new Date().getFullYear());

    return (

        <div
            style={{
                maxWidth: "600px",
                margin: "auto",
                padding: "20px"
            }}
        >

            <h1>📅 Consultar cierre mensual</h1>

            <p>

                Selecciona el año y el mes que deseas consultar.

            </p>

            <label>

                <strong>Año</strong>

            </label>

            <select

                value={año}

                onChange={(e)=>setAño(e.target.value)}

                style={{
                    width:"100%",
                    padding:"12px",
                    marginTop:"5px",
                    marginBottom:"20px"
                }}

            >

                <option value="2026">2026</option>

                <option value="2027">2027</option>

                <option value="2028">2028</option>

                <option value="2029">2029</option>

                <option value="2030">2030</option>

            </select>

            <label>

                <strong>Mes</strong>

            </label>

            <select

                value={mes}

                onChange={(e)=>setMes(e.target.value)}

                style={{
                    width:"100%",
                    padding:"12px",
                    marginTop:"5px",
                    marginBottom:"20px"
                }}

            >

                <option value="1">Enero</option>

                <option value="2">Febrero</option>

                <option value="3">Marzo</option>

                <option value="4">Abril</option>

                <option value="5">Mayo</option>

                <option value="6">Junio</option>

                <option value="7">Julio</option>

                <option value="8">Agosto</option>

                <option value="9">Septiembre</option>

                <option value="10">Octubre</option>

                <option value="11">Noviembre</option>

                <option value="12">Diciembre</option>

            </select>
                        <button

                onClick={() =>

                    navigate(`/consulta-mes/${mes}/${año}`)

                }

                style={{

                    width: "100%",

                    padding: "15px",

                    background: "#1976d2",

                    color: "white",

                    border: "none",

                    borderRadius: "10px",

                    cursor: "pointer",

                    fontSize: "16px",

                    marginBottom: "15px"

                }}

            >

                🔍 Consultar

            </button>

            <button

                onClick={() => navigate("/estadisticas")}

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