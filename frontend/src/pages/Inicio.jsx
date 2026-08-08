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



async function cargarResumen(){


    try{


        const respuesta = await fetch(

            "https://vivekfe-backend.onrender.com/resumen/hoy"

        );



        const datos = await respuesta.json();



        console.log("RESUMEN RECIBIDO:", datos);



        setHoy({

            ventas: Number(datos.ventas) || 0,

            gastos: Number(datos.gastos) || 0,

            ganancia: Number(datos.ganancia) || 0

        });



    }catch(error){


        console.error("ERROR RESUMEN:", error);


        setHoy({

            ventas:0,

            gastos:0,

            ganancia:0

        });


    }


}




useEffect(()=>{

    cargarResumen();

},[]);





return (

<div className="contenedor">


<div className="titulo">

<h1>🌿 Vivekfe</h1>

<p>Control diario del vivero</p>

</div>



<button

className="verde"

onClick={()=>navigate("/nueva-venta")}

>

➕ Nueva Venta

</button>




<button

className="rojo"

onClick={()=>navigate("/nuevo-gasto")}

>

💸 Nuevo Gasto

</button>




<div className="fecha">

<h3>📅 Hoy</h3>

<p>

{new Date().toLocaleDateString("es-CO")}

</p>

</div>





<div className="card">

<span>💰 Ventas del día</span>

<h2>

${hoy.ventas.toLocaleString("es-CO")}

</h2>

</div>





<div className="card">

<span>💸 Gastos del día</span>

<h2>

${hoy.gastos.toLocaleString("es-CO")}

</h2>

</div>





<div className="card">

<span>📈 Ganancia del día</span>

<h2>

${hoy.ganancia.toLocaleString("es-CO")}

</h2>

</div>





<button

className="azul"

onClick={()=>navigate("/historial")}

>

📖 Historial

</button>




<button

className="gris"

onClick={()=>navigate("/estadisticas")}

>

📊 Estadísticas

</button>




<button

className="gris"

onClick={()=>navigate("/configuracion")}

>

⚙ Configuración

</button>




</div>

);

}