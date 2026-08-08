import { useNavigate } from "react-router-dom";

export default function Meses() {


const navigate = useNavigate();



const meses = [

    {numero:1, nombre:"Enero"},
    {numero:2, nombre:"Febrero"},
    {numero:3, nombre:"Marzo"},
    {numero:4, nombre:"Abril"},
    {numero:5, nombre:"Mayo"},
    {numero:6, nombre:"Junio"},
    {numero:7, nombre:"Julio"},
    {numero:8, nombre:"Agosto"},
    {numero:9, nombre:"Septiembre"},
    {numero:10, nombre:"Octubre"},
    {numero:11, nombre:"Noviembre"},
    {numero:12, nombre:"Diciembre"}

];



const año = new Date().getFullYear();



return (

<div
style={{
    maxWidth:"500px",
    margin:"auto",
    padding:"20px",
    textAlign:"center"
}}
>


<h1>
📅 Consultar mes
</h1>


<p>
Selecciona el mes que quieres revisar
</p>



{

meses.map((mes)=>(


<button

key={mes.numero}

onClick={()=>navigate(`/consulta-mes/${mes.numero}/${año}`)}

style={{

    width:"100%",

    padding:"15px",

    margin:"5px",

    borderRadius:"10px",

    border:"none",

    cursor:"pointer",

    fontSize:"18px",

    fontWeight:"bold",

    color:"#222",

    background:"#ffffff"

}}

>

{mes.nombre} {año}

</button>


))

}





<button

onClick={()=>navigate("/")}

style={{

    width:"100%",

    padding:"15px",

    marginTop:"20px",

    borderRadius:"10px",

    background:"#2e7d32",

    color:"white",

    border:"none"

}}

>

⬅ Volver al inicio

</button>


</div>

);


}