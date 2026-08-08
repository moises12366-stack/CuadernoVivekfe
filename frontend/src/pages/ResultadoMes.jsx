import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export default function ResultadoMes() {


const navigate = useNavigate();


const parametros = useParams();


const mes = parametros.mes;

const anio = parametros.anio || parametros.año;



const [datos,setDatos] = useState(null);




useEffect(()=>{


async function cargar(){


    try{


        const respuesta = await fetch(

            `https://vivekfe-backend.onrender.com/estadisticas/mes/${mes}/${anio}`

        );


        const json = await respuesta.json();


        console.log("DATOS MES:",json);



        setDatos({

            ventas: Number(json.ventas) || 0,

            gastos: Number(json.gastos) || 0,

            ganancia: Number(json.ganancia) || 0,


            numeroVentas: Number(json.numeroVentas) || 0,

            numeroGastos: Number(json.numeroGastos) || 0,


            promedioVenta: Number(json.promedioVenta) || 0,


            codigoMasVendido: json.codigoMasVendido || "-",


            codigoMasDinero: json.codigoMasDinero || "-"

        });



    }catch(error){


        console.log(error);



        setDatos({

            ventas:0,

            gastos:0,

            ganancia:0,

            numeroVentas:0,

            numeroGastos:0,

            promedioVenta:0,

            codigoMasVendido:"-",

            codigoMasDinero:"-"

        });


    }


}


cargar();


},[mes,anio]);





if(!datos){


return (

<div

style={{

padding:"30px",

textAlign:"center"

}}

>

Cargando información...

</div>

);


}





return (


<div

style={{

maxWidth:"600px",

margin:"auto",

padding:"20px"

}}

>



<h1>

📅 Cierre {mes}/{anio}

</h1>




<div

style={{

background:"#fff",

padding:"20px",

borderRadius:"10px",

marginBottom:"20px"

}}

>


<h2>💰 Resultado</h2>



<p>

Ventas:

<br/>

${datos.ventas.toLocaleString("es-CO")}

</p>



<p>

Gastos:

<br/>

${datos.gastos.toLocaleString("es-CO")}

</p>



<p>

Ganancia final:

<br/>

${datos.ganancia.toLocaleString("es-CO")}

</p>


</div>





<div

style={{

background:"#fff",

padding:"20px",

borderRadius:"10px"

}}

>


<h2>📊 Detalles</h2>



<p>

🧾 Ventas realizadas:

<br/>

{datos.numeroVentas}

</p>



<p>

💸 Gastos registrados:

<br/>

{datos.numeroGastos}

</p>



<p>

💵 Promedio venta:

<br/>

${datos.promedioVenta.toLocaleString("es-CO")}

</p>



<p>

🏆 Código más vendido:

<br/>

{datos.codigoMasVendido}

</p>



<p>

💰 Código que más dinero produjo:

<br/>

{datos.codigoMasDinero}

</p>


</div>





<button

onClick={()=>navigate("/meses")}

style={{

width:"100%",

padding:"15px",

marginTop:"20px",

background:"#1976d2",

color:"white",

border:"none",

borderRadius:"10px"

}}

>

📅 Consultar otro mes

</button>




<button

onClick={()=>navigate("/")}

style={{

width:"100%",

padding:"15px",

marginTop:"10px",

background:"#2e7d32",

color:"white",

border:"none",

borderRadius:"10px"

}}

>

⬅ Inicio

</button>



</div>


);


}