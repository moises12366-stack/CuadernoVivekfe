import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Editar() {

    const { id, tipo } = useParams();
    const navigate = useNavigate();

    const [codigo, setCodigo] = useState("");
    const [valor, setValor] = useState("");
    const [pago, setPago] = useState("Efectivo");

    useEffect(() => {

        async function cargar() {

            const ruta =
                tipo === "venta"
                    ? `http://localhost:3001/ventas/${id}`
                    : `http://localhost:3001/gastos/${id}`;

            const respuesta = await fetch(ruta);

            const datos = await respuesta.json();

            if (tipo === "venta") {

                setCodigo(datos.codigo);
                setPago(datos.pago);

            } else {

                setCodigo(datos.descripcion);

            }

            setValor(datos.valor);

        }

        cargar();

    }, [id, tipo]);

    async function guardar() {

        const ruta =
            tipo === "venta"
                ? `http://localhost:3001/ventas/${id}`
                : `http://localhost:3001/gastos/${id}`;

        const body =
            tipo === "venta"
                ? {
                      codigo,
                      valor,
                      pago
                  }
                : {
                      descripcion: codigo,
                      valor
                  };

        await fetch(ruta, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)

        });

        alert("Registro actualizado.");

        navigate("/historial");

    }

    return (

        <div
            style={{
                maxWidth: "500px",
                margin: "30px auto",
                padding: "20px"
            }}
        >

            <h1>

                {tipo === "venta"
                    ? "✏ Editar Venta"
                    : "✏ Editar Gasto"}

            </h1>

            <label>

                {tipo === "venta"
                    ? "Código"
                    : "Descripción"}

            </label>

            <input

                value={codigo}

                onChange={(e)=>setCodigo(e.target.value)}

                style={{
                    width:"100%",
                    padding:"10px",
                    marginBottom:"15px"
                }}

            />

            <label>Valor</label>

            <input

                type="number"

                value={valor}

                onChange={(e)=>setValor(e.target.value)}

                style={{
                    width:"100%",
                    padding:"10px",
                    marginBottom:"15px"
                }}

            />

            {tipo==="venta" && (

                <>

                    <label>Forma de pago</label>

                    <select

                        value={pago}

                        onChange={(e)=>setPago(e.target.value)}

                        style={{
                            width:"100%",
                            padding:"10px",
                            marginBottom:"20px"
                        }}

                    >

                        <option>Efectivo</option>

                        <option>Nequi</option>

                    </select>

                </>

            )}

            <button

                onClick={guardar}

                style={{
                    width:"100%",
                    padding:"12px",
                    background:"#2e7d32",
                    color:"white",
                    border:"none",
                    borderRadius:"8px",
                    cursor:"pointer"
                }}

            >

                Guardar cambios

            </button>

        </div>

    );

}