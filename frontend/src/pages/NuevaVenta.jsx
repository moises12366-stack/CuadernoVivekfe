import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NuevaVenta.css";

export default function NuevaVenta() {

    const navigate = useNavigate();

    const [codigo, setCodigo] = useState("");
    const [valor, setValor] = useState("");
    const [pago, setPago] = useState("Efectivo");


    async function guardarVenta() {


        if (codigo.trim() === "") {

            alert("Escribe el código.");

            return;

        }


        if (valor === "" || Number(valor) <= 0) {

            alert("Escribe un valor válido.");

            return;

        }



        try {


            const respuesta = await fetch(
                "https://vivekfe-backend-mxhh.onrender.com/ventas",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },


                    body: JSON.stringify({

                        codigo: codigo.trim(),

                        valor: Number(valor),

                        pago

                    })

                }
            );



            const datos = await respuesta.json();



            if (!respuesta.ok) {

                console.error("Error backend:", datos);

                throw new Error(
                    datos.detalle || datos.error || "No se pudo guardar"
                );

            }



            alert("Venta guardada correctamente.");


            navigate("/");



        } catch(error) {


            console.error("ERROR GUARDANDO VENTA:", error);


            alert(
                "Error al guardar la venta:\n" +
                error.message
            );


        }


    }



    return (

        <div className="contenedor">


            <h1>➕ Nueva Venta</h1>



            <label>Código</label>


            <input

                type="text"

                value={codigo}

                onChange={(e)=>setCodigo(e.target.value)}

                placeholder="Ej: 4.2.1"

            />



            <label>Valor</label>


            <input

                type="number"

                value={valor}

                onChange={(e)=>setValor(e.target.value)}

                placeholder="0"

            />



            <label>Forma de pago</label>


            <select

                value={pago}

                onChange={(e)=>setPago(e.target.value)}

            >

                <option>Efectivo</option>

                <option>Nequi</option>

            </select>




            <button

                className="guardar"

                onClick={guardarVenta}

            >

                Guardar Venta

            </button>



            <button

                className="volver"

                onClick={()=>navigate("/")}

            >

                ← Volver

            </button>



        </div>

    );

}