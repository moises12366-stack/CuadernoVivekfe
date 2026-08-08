const db = require("../database");


// GUARDAR GASTO

async function guardarGasto(req, res) {

    console.log("DATOS RECIBIDOS GASTO:", req.body);

    try {

        const { descripcion, valor } = req.body;


        const ahora = new Date();

        const fecha = ahora.toLocaleDateString("es-CO");
        const hora = ahora.toLocaleTimeString("es-CO");


        const resultado = await db.query(
            `
            INSERT INTO gastos
            (descripcion, valor, fecha, hora)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                descripcion,
                Number(valor),
                fecha,
                hora
            ]
        );


        res.json({

            ok:true,

            gasto:resultado.rows[0]

        });



    } catch(error) {


        console.log("ERROR GUARDANDO GASTO:", error);


        res.status(500).json({

            error:"Error al guardar gasto",

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




// ACTUALIZAR GASTO

async function actualizarGasto(req,res){

    try{


        const {descripcion, valor}=req.body;


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





// ELIMINAR GASTO

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





// TOTAL GASTOS HOY

async function totalGastosHoy(req,res){


    try{


        const hoy = new Date().toLocaleDateString("es-CO");



        const resultado = await db.query(

            `
            SELECT COALESCE(SUM(valor),0) AS total
            FROM gastos
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





module.exports = {

    guardarGasto,

    obtenerGasto,

    actualizarGasto,

    totalGastosHoy,

    eliminarGasto

};