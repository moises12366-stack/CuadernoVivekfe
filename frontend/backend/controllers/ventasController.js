const db = require("../database");


// ===============================
// GUARDAR VENTA
// ===============================

async function guardarVenta(req,res){

    try{

        const {codigo, valor, pago} = req.body;


        const ahora = new Date();

        const fecha = ahora.toLocaleDateString("es-CO");

        const hora = ahora.toLocaleTimeString("es-CO");



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


const hoy = new Date().toLocaleDateString("es-CO");



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


const hoy = new Date().toLocaleDateString("es-CO");



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


const hoy = new Date();



const diaSemana = hoy.getDay() || 7;



const lunes = new Date(hoy);


lunes.setDate(
    hoy.getDate() - (diaSemana - 1)
);



lunes.setHours(0,0,0,0);



const domingo = new Date(lunes);


domingo.setDate(
    lunes.getDate()+6
);



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



let totalVentas = 0;

let totalGastos = 0;




function dentroSemana(fecha){


const partes = fecha.split("/");


if(partes.length!==3){

return false;

}



const fechaRegistro = new Date(

Number(partes[2]),

Number(partes[1])-1,

Number(partes[0])

);



return fechaRegistro >= lunes &&
       fechaRegistro <= domingo;


}




ventas.rows.forEach(v=>{


if(dentroSemana(v.fecha)){


totalVentas += Number(v.valor) || 0;


}


});





gastos.rows.forEach(g=>{


if(dentroSemana(g.fecha)){


totalGastos += Number(g.valor) || 0;


}


});





res.json({

ventas:totalVentas,

gastos:totalGastos,

ganancia:totalVentas-totalGastos

});





}catch(error){


console.log("ERROR SEMANA:",error);



res.status(500).json({

error:error.message

});


}



}








// ===============================
// RESUMEN MES ACTUAL
// ===============================


async function resumenMes(req,res){


try{


const hoy = new Date();


const mes = hoy.getMonth()+1;


const año = hoy.getFullYear();



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



let totalVentas=0;

let totalGastos=0;





function perteneceMes(fecha){


const partes=fecha.split("/");


return (

Number(partes[1])===mes &&

Number(partes[2])===año

);


}





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


const partes=req.params.fecha.split("-");


const fecha =

`${Number(partes[2])}/${Number(partes[1])}/${Number(partes[0])}`;





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



ORDER BY hora DESC

`,

[fecha]

);



res.json(resultado.rows);



}catch(error){


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



const hoy = new Date();


const mes = hoy.getMonth()+1;

const año = hoy.getFullYear();



let ventasMes=[];

let gastosMes=[];



function mismoMes(fecha){


const partes=fecha.split("/");


return (

Number(partes[1])===mes &&

Number(partes[2])===año

);


}





ventas.rows.forEach(v=>{

if(mismoMes(v.fecha)){

ventasMes.push(v);

}

});





gastos.rows.forEach(g=>{

if(mismoMes(g.fecha)){

gastosMes.push(g);

}

});





const totalVentas = ventasMes.reduce(

(a,b)=>a+Number(b.valor||0),

0

);



const totalGastos = gastosMes.reduce(

(a,b)=>a+Number(b.valor||0),

0

);





const promedioVenta = ventasMes.length

? totalVentas/ventasMes.length

:0;





res.json({

ventasMes:totalVentas,

gastosMes:totalGastos,

gananciaMes:totalVentas-totalGastos,

numeroVentas:ventasMes.length,

numeroGastos:gastosMes.length,

promedioVenta,

codigoMasVendido:"-",

cantidadMayor:0,

codigoMasDinero:"-",

dineroMayor:0

});





}catch(error){


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


const partes=fecha.split("/");


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


res.status(500).json({

error:error.message

});


}


}







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