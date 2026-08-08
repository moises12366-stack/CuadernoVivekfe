const db = require("../database");


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



// GUARDAR GASTO

async function guardarGasto(req,res){

    try{

        console.log("GASTO RECIBIDO:", req.body);


        const {descripcion, valor} = req.body;


        if(!descripcion || !valor){

            return res.status(400).json({
                error:"Datos incompletos"
            });

        }


        const resultado = await db.query(

            `
            INSERT INTO gastos
            (
            descripcion,
            valor,
            fecha,
            hora
            )

            VALUES
            ($1,$2,$3,$4)

            RETURNING *
            `,

            [
                descripcion,
                Number(valor),
                obtenerFecha(),
                obtenerHora()
            ]

        );


        console.log("GASTO GUARDADO:", resultado.rows[0]);


        res.json({

            ok:true,

            gasto:resultado.rows[0]

        });


    }catch(error){

        console.log("ERROR GUARDANDO GASTO:",error);


        res.status(500).json({

            error:"Error guardando gasto",
            detalle:error.message

        });

    }

}



// OBTENER GASTO

async function obtenerGasto(req,res){

    try{

        const resultado = await db.query(

            `
            SELECT *
            FROM gastos
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



// ACTUALIZAR

async function actualizarGasto(req,res){

    try{

        const {descripcion,valor}=req.body;


        await db.query(

            `
            UPDATE gastos

            SET descripcion=$1,
            valor=$2

            WHERE id=$3
            `,

            [
                descripcion,
                Number(valor),
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



// ELIMINAR

async function eliminarGasto(req,res){

    try{


        await db.query(

            `
            DELETE FROM gastos
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



// TOTAL HOY

async function totalGastosHoy(req,res){

    try{


        const resultado = await db.query(

            `
            SELECT COALESCE(SUM(valor),0) AS total
            FROM gastos
            `

        );


        res.json({

            total:Number(resultado.rows[0].total)||0

        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}



module.exports={

guardarGasto,
obtenerGasto,
actualizarGasto,
totalGastosHoy,
eliminarGasto

};