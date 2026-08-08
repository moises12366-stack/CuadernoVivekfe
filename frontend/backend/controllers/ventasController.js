const db = require("../database");


// GUARDAR VENTA

async function guardarVenta(req,res){

    try{

        console.log("DATOS RECIBIDOS VENTA:", req.body);

        const {codigo, valor, pago} = req.body;


        const ahora = new Date();

        const fecha = ahora.toLocaleDateString("es-CO");
        const hora = ahora.toLocaleTimeString("es-CO");


        const resultado = await db.query(
            `
            INSERT INTO ventas
            (codigo, valor, pago, fecha, hora)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
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
            venta:resultado.rows[0]
        });



    }catch(error){

        console.log("ERROR VENTA:",error);

        res.status(500).json({
            error:error.message
        });

    }

}




// OBTENER VENTA

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


        res.json(resultado.rows[0]);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}




// ACTUALIZAR VENTA

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





// ELIMINAR VENTA

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





// TOTAL VENTAS HOY

async function totalVentasHoy(req,res){

    try{


        const hoy = new Date().toLocaleDateString("es-CO");


        const resultado = await db.query(
            `
            SELECT COALESCE(SUM(valor),0) AS total
            FROM ventas
            WHERE fecha=$1
            `,
            [
                hoy
            ]
        );


        res.json({
            total:Number(resultado.rows[0].total)
        });



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}





// RESUMEN HOY

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


        const totalVentas = Number(ventas.rows[0].total);
        const totalGastos = Number(gastos.rows[0].total);


        res.json({

            ventas: totalVentas,

            gastos: totalGastos,

            ganancia: totalVentas-totalGastos

        });



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}





// RESUMEN SEMANA

async function resumenSemana(req,res){

    res.json({
        ventas:0,
        gastos:0,
        ganancia:0
    });

}





// RESUMEN MES

async function resumenMes(req,res){

    res.json({
        ventas:0,
        gastos:0,
        ganancia:0
    });

}





// HISTORIAL

async function historial(req,res){

    try{


        const resultado = await db.query(
            `
            SELECT 
            id,
            codigo AS descripcion,
            valor,
            fecha,
            hora,
            'venta' AS tipo
            FROM ventas

            UNION ALL

            SELECT
            id,
            descripcion,
            valor,
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





async function buscarPorFecha(req,res){

    try{

        const resultado = await db.query(
            `
            SELECT *
            FROM ventas
            WHERE fecha=$1
            `,
            [
                req.params.fecha
            ]
        );


        res.json(resultado.rows);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}





async function estadisticas(req,res){

    res.json({
        ventas:0,
        gastos:0,
        ganancia:0
    });

}



async function estadisticasMes(req,res){

    res.json({
        ventas:0,
        gastos:0,
        ganancia:0
    });

}




module.exports={

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