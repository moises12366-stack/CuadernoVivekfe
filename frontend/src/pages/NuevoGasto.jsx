import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NuevaVenta.css";


export default function NuevoGasto() {


const navigate = useNavigate();


const [descripcion,setDescripcion] = useState("");

const [valor,setValor] = useState("");

const [guardando,setGuardando] = useState(false);





async function guardarGasto(){


if(descripcion.trim()===""){

alert("Escribe una descripción.");

return;

}



if(valor==="" || Number(valor)<=0){

alert("Escribe un valor válido.");

return;

}



setGuardando(true);



try{


const respuesta = await fetch(

"https://vivekfe-backend-mxhh.onrender.com/gastos",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

descripcion:descripcion.trim(),

valor:Number(valor)

})


}

);




const datos = await respuesta.json();



console.log("RESPUESTA GASTO:",datos);



if(!respuesta.ok){

throw new Error(

datos.detalle || datos.error || "No se pudo guardar"

);

}




if(datos.ok!==true){

throw new Error("El servidor no confirmó el guardado");

}



alert("Gasto guardado correctamente.");



setDescripcion("");

setValor("");



navigate("/");





}catch(error){


console.error("ERROR GASTO:",error);


alert(

"Error al guardar gasto:\n"+error.message

);



}finally{


setGuardando(false);


}



}







return (


<div className="contenedor">



<h1>💸 Nuevo Gasto</h1>



<label>

Descripción

</label>



<input

type="text"

value={descripcion}

onChange={(e)=>setDescripcion(e.target.value)}

placeholder="Ej: Compra de materas"

/>




<label>

Valor

</label>



<input

type="number"

value={valor}

onChange={(e)=>setValor(e.target.value)}

placeholder="0"

/>





<button

className="guardar"

onClick={guardarGasto}

disabled={guardando}

>

{guardando ? "Guardando..." : "Guardar Gasto"}


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