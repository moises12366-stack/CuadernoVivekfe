const db = require("../database");


// ===============================
// FUNCIONES DE FECHA
// ===============================

function obtenerFecha(){

    const ahora = new Date();

    const dia = String(ahora.getDate()).padStart(2,"0");

    const mes = String(ahora.getMonth()+1).padStart(2,"0");

    const año = ahora.getFullYear();


    return `${dia}/${mes}/${año}`;

}


function obtenerHora(){

    const ahora = new Date();

    return ahora.toLocaleTimeString("es-CO");

}




// ===============================
// GUARDAR VENTA
// ===============================

async function guardarVenta(req,res){

try{


const {codigo, valor, pago} = req.body;


const resultado = await db.query(

`
INSERT INTO ventas
(
codigo,
valor,
pago,
fecha,
hora
)

VALUES
($1,$2,$3,$4,$5)

RETURNING id
`,

[

codigo,

Number(valor),

pago,

obtenerFecha(),

obtenerHora()

]

);



res.json({

ok:true,

id:resultado.rows[0].id

});



}catch(error){


console.log("ERROR VENTA:",error);


res.status(500).json({

error:error.message

});


}


}





// ===============================
// OBTENER VENTA
// ===============================


async function obtenerVenta(req,res){


try{


const resultado = await db.query(

`
SELECT *

FROM ventas

WHERE id=$1

`,

[req.params.id]

);



res.json(resultado.rows[0] || null);



}catch(error){


res.status(500).json({

error:error.message

});


}


}





// ===============================
// ACTUALIZAR VENTA
// ===============================


async function actualizarVenta(req,res){


try{


const {codigo,valor,pago}=req.body;



await db.query(

`
UPDATE ventas

SET codigo=$1,
valor=$2,
pago=$3

WHERE id=$4

`,

[

codigo,

Number(valor),

pago,

req.params.id

]

);



res.json({

ok:true

});



}catch(error){


res.status(500).json({

error:error.message

});


}


}





// ===============================
// ELIMINAR VENTA
// ===============================


async function eliminarVenta(req,res){


try{


await db.query(

`
DELETE FROM ventas

WHERE id=$1

`,

[req.params.id]

);



res.json({

ok:true

});



}catch(error){


res.status(500).json({

error:error.message

});


}


}
// ===============================
// TOTAL VENTAS HOY
// ===============================

async function totalVentasHoy(req,res){

try{


const resultado = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM ventas

WHERE fecha=$1

`,

[obtenerFecha()]

);



res.json({

total:Number(resultado.rows[0].total) || 0

});



}catch(error){


res.status(500).json({

error:error.message

});


}


}






// ===============================
// RESUMEN HOY
// ===============================


async function resumenHoy(req,res){

try{


const fecha = obtenerFecha();



const ventas = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM ventas

WHERE fecha=$1

`,

[fecha]

);



const gastos = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM gastos

WHERE fecha=$1

`,

[fecha]

);



const totalVentas =
Number(ventas.rows[0].total) || 0;



const totalGastos =
Number(gastos.rows[0].total) || 0;



res.json({

ventas:totalVentas,

gastos:totalGastos,

ganancia:totalVentas-totalGastos

});



}catch(error){


console.log("ERROR RESUMEN HOY:",error);



res.status(500).json({

error:error.message

});


}


}






// ===============================
// RESUMEN SEMANA
// ===============================


async function resumenSemana(req,res){

try{


const ventas = await db.query(

`
SELECT valor,fecha

FROM ventas

`

);



const gastos = await db.query(

`
SELECT valor,fecha

FROM gastos

`

);




const hoy = new Date();


const dia = hoy.getDay() || 7;



const lunes = new Date(hoy);


lunes.setDate(

hoy.getDate()-(dia-1)

);


lunes.setHours(0,0,0,0);




const domingo = new Date(lunes);


domingo.setDate(

lunes.getDate()+6

);





function dentroSemana(fecha){


if(!fecha) return false;



const partes = fecha.split("/");


if(partes.length !== 3){

return false;

}



const registro = new Date(

Number(partes[2]),

Number(partes[1])-1,

Number(partes[0])

);



return registro >= lunes && registro <= domingo;


}




let totalVentas = 0;

let totalGastos = 0;





ventas.rows.forEach(v=>{


if(dentroSemana(v.fecha)){


totalVentas += Number(v.valor)||0;


}


});





gastos.rows.forEach(g=>{


if(dentroSemana(g.fecha)){


totalGastos += Number(g.valor)||0;


}


});





res.json({

ventas:totalVentas,

gastos:totalGastos,

ganancia:totalVentas-totalGastos

});




}catch(error){


res.status(500).json({

error:error.message

});


}


}
// ===============================
// RESUMEN MES
// ===============================

async function resumenMes(req,res){

try{


const ahora = new Date();


const mes = ahora.getMonth()+1;

const año = ahora.getFullYear();



const ventas = await db.query(

`
SELECT valor,fecha

FROM ventas

`

);



const gastos = await db.query(

`
SELECT valor,fecha

FROM gastos

`

);





function perteneceMes(fecha){


if(!fecha) return false;


const partes = fecha.split("/");


if(partes.length !== 3){

return false;

}



return (

Number(partes[1]) === mes &&

Number(partes[2]) === año

);


}





let totalVentas = 0;

let totalGastos = 0;



ventas.rows.forEach(v=>{


if(perteneceMes(v.fecha)){


totalVentas += Number(v.valor)||0;


}


});





gastos.rows.forEach(g=>{


if(perteneceMes(g.fecha)){


totalGastos += Number(g.valor)||0;


}


});





res.json({

ventas:totalVentas,

gastos:totalGastos,

ganancia:totalVentas-totalGastos

});



}catch(error){


console.log("ERROR RESUMEN MES:",error);



res.status(500).json({

error:error.message

});


}


}








// ===============================
// HISTORIAL
// ===============================


async function historial(req,res){

try{


const resultado = await db.query(

`
SELECT

id,

codigo,

valor,

pago,

fecha,

hora,

'venta' AS tipo


FROM ventas



UNION ALL



SELECT

id,

descripcion AS codigo,

valor,

'' AS pago,

fecha,

hora,

'gasto' AS tipo


FROM gastos



ORDER BY id DESC

`

);



res.json(resultado.rows);



}catch(error){


console.log("ERROR HISTORIAL:",error);



res.status(500).json({

error:error.message

});


}


}








// ===============================
// BUSCAR POR FECHA
// ===============================


async function buscarPorFecha(req,res){

try{


const partes = req.params.fecha.split("-");



const fecha =

`${partes[2]}/${partes[1]}/${partes[0]}`;





const resultado = await db.query(

`
SELECT

id,

codigo,

valor,

pago,

fecha,

hora,

'venta' AS tipo


FROM ventas


WHERE fecha=$1




UNION ALL




SELECT

id,

descripcion AS codigo,

valor,

'' AS pago,

fecha,

hora,

'gasto' AS tipo


FROM gastos


WHERE fecha=$1



ORDER BY id DESC

`,

[fecha]

);



res.json(resultado.rows);



}catch(error){


console.log("ERROR BUSCAR FECHA:",error);



res.status(500).json({

error:error.message

});


}


}
// ===============================
// ESTADISTICAS
// ===============================


async function estadisticas(req,res){

try{


const ahora = new Date();


const mes = ahora.getMonth()+1;

const año = ahora.getFullYear();




const ventas = await db.query(

`
SELECT *

FROM ventas

`

);



const gastos = await db.query(

`
SELECT *

FROM gastos

`

);






function perteneceMes(fecha){


if(!fecha) return false;



const partes = fecha.split("/");



if(partes.length !== 3){

return false;

}



return (

Number(partes[1])===mes &&

Number(partes[2])===año

);


}





const ventasMes = ventas.rows.filter(

v=>perteneceMes(v.fecha)

);



const gastosMes = gastos.rows.filter(

g=>perteneceMes(g.fecha)

);






const totalVentas = ventasMes.reduce(

(total,item)=>

total + Number(item.valor || 0),

0

);





const totalGastos = gastosMes.reduce(

(total,item)=>

total + Number(item.valor || 0),

0

);





let codigoMasVendido="-";

let cantidadMayor=0;

let codigoMasDinero="-";

let dineroMayor=0;



const contador={};



ventasMes.forEach(v=>{


contador[v.codigo] =

(contador[v.codigo] || 0)+1;



});





Object.keys(contador).forEach(codigo=>{


if(contador[codigo]>cantidadMayor){

cantidadMayor=contador[codigo];

codigoMasVendido=codigo;

}


});





ventasMes.forEach(v=>{


if(Number(v.valor)>dineroMayor){


dineroMayor=Number(v.valor);

codigoMasDinero=v.codigo;


}


});





res.json({

ventasMes:totalVentas,

gastosMes:totalGastos,

gananciaMes:totalVentas-totalGastos,

numeroVentas:ventasMes.length,

numeroGastos:gastosMes.length,

promedioVenta:

ventasMes.length

?

totalVentas/ventasMes.length

:

0,


codigoMasVendido,

cantidadMayor,

codigoMasDinero,

dineroMayor

});




}catch(error){


console.log("ERROR ESTADISTICAS:",error);



res.status(500).json({

error:error.message

});


}


}








// ===============================
// ESTADISTICAS MES ESPECIFICO
// ===============================


async function estadisticasMes(req,res){

try{


const mes = Number(req.params.mes);

const año = Number(req.params.anio);





const ventas = await db.query(

`
SELECT *

FROM ventas

`

);



const gastos = await db.query(

`
SELECT *

FROM gastos

`

);






function pertenece(fecha){


if(!fecha) return false;



const partes = fecha.split("/");



if(partes.length!==3){

return false;

}



return (

Number(partes[1])===mes &&

Number(partes[2])===año

);


}






const ventasMes = ventas.rows.filter(

v=>pertenece(v.fecha)

);



const gastosMes = gastos.rows.filter(

g=>pertenece(g.fecha)

);






const totalVentas = ventasMes.reduce(

(a,b)=>a+Number(b.valor||0),

0

);





const totalGastos = gastosMes.reduce(

(a,b)=>a+Number(b.valor||0),

0

);





res.json({

ventas:totalVentas,

gastos:totalGastos,

ganancia:totalVentas-totalGastos,

numeroVentas:ventasMes.length,

numeroGastos:gastosMes.length,

promedioVenta:

ventasMes.length

?

totalVentas/ventasMes.length

:

0,


codigoMasVendido:"-",

cantidadMayor:0,

codigoMasDinero:"-",

dineroMayor:0

});




}catch(error){


console.log("ERROR ESTADISTICAS MES:",error);



res.status(500).json({

error:error.message

});


}


}







// ===============================
// EXPORTAR FUNCIONES
// ===============================


module.exports = {


guardarVenta,

obtenerVenta,

actualizarVenta,

eliminarVenta,

totalVentasHoy,

resumenHoy,

resumenSemana,

resumenMes,

historial,

buscarPorFecha,

estadisticas,

estadisticasMes


};