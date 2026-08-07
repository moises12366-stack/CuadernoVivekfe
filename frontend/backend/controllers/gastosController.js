const db = require("../database");


function guardarGasto(req, res) {


    const { descripcion, valor } = req.body;


    const ahora = new Date();


    const fecha = ahora.toLocaleDateString("es-CO");
    const hora = ahora.toLocaleTimeString("es-CO");


    db.query(

        `INSERT INTO gastos 
        (descripcion, valor, fecha, hora)
        VALUES ($1,$2,$3,$4)
        RETURNING id`,

        [
            descripcion.trim(),
            Number(valor),
            fecha,
            hora
        ],


        (err, resultado)=>{


            if(err){

                console.log("ERROR GASTO:", err);

                return res.status(500).json({

                    error:"Error al guardar gasto",

                    detalle:err.message

                });

            }



            res.json({

                ok:true,

                id:resultado.rows[0].id

            });


        }

    );


}





function obtenerGasto(req,res){


    db.query(

        `SELECT * FROM gastos WHERE id=$1`,

        [req.params.id],


        (err,resultado)=>{


            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }


            res.json(resultado.rows[0]);


        }

    );


}





function actualizarGasto(req,res){


    const {descripcion, valor}=req.body;



    db.query(

        `UPDATE gastos
         SET descripcion=$1,
             valor=$2
         WHERE id=$3`,

        [

            descripcion,

            Number(valor),

            req.params.id

        ],


        (err)=>{


            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }



            res.json({

                ok:true

            });


        }

    );


}






function eliminarGasto(req,res){


    db.query(

        `DELETE FROM gastos WHERE id=$1`,

        [req.params.id],


        (err)=>{


            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }



            res.json({

                ok:true

            });


        }

    );


}







function totalGastosHoy(req,res){


    const hoy = new Date().toLocaleDateString("es-CO");



    db.query(

        `SELECT COALESCE(SUM(valor),0) AS total
         FROM gastos
         WHERE fecha=$1`,


        [hoy],


        (err,resultado)=>{


            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }



            res.json({

                total:Number(resultado.rows[0].total)

            });


        }

    );


}






module.exports = {


    guardarGasto,

    obtenerGasto,

    actualizarGasto,

    totalGastosHoy,

    eliminarGasto


};