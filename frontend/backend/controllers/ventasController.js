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

    return new Date().toLocaleTimeString("es-CO");

}



// ===============================
// GUARDAR VENTA
// ===============================


async function guardarVenta(req,res){

try{


const {codigo, valor, pago} = req.body;


const fecha = obtenerFecha();

const hora = obtenerHora();



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
fecha,
hora
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

[
req.params.id
]

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


const {codigo, valor, pago}=req.body;



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

[
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
// TOTAL VENTAS HOY
// ===============================


async function totalVentasHoy(req,res){

try{


const hoy = obtenerFecha();



const resultado = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM ventas

WHERE fecha=$1
`,

[hoy]

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
// RESUMEN DEL DIA
// ===============================


async function resumenHoy(req,res){

try{


const hoy = obtenerFecha();



const ventas = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM ventas

WHERE fecha=$1
`,

[hoy]

);



const gastos = await db.query(

`
SELECT COALESCE(SUM(valor),0) AS total

FROM gastos

WHERE fecha=$1
`,

[hoy]

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


console.log("ERROR RESUMEN:",error);


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
    hoy.getDate() - (dia - 1)
);


lunes.setHours(0,0,0,0);



const domingo = new Date(lunes);

domingo.setDate(
    lunes.getDate()+6
);



function dentroSemana(fecha){


const partes = fecha.split("/");


if(partes.length !== 3){
    return false;
}


const registro = new Date(

Number(partes[2]),

Number(partes[1])-1,

Number(partes[0])

);



return registro >= lunes &&
       registro <= domingo;


}



let totalVentas=0;

let totalGastos=0;



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



function pertenece(fecha){


const partes = fecha.split("/");


return (

Number(partes[1])===mes &&

Number(partes[2])===año

);


}



let totalVentas=0;

let totalGastos=0;



ventas.rows.forEach(v=>{

if(pertenece(v.fecha)){

totalVentas += Number(v.valor)||0;

}

});



gastos.rows.forEach(g=>{

if(pertenece(g.fecha)){

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