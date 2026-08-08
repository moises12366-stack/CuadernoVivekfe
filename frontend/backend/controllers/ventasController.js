const db = require("../database");


function guardarVenta(req, res) {

    const { codigo, valor, pago } = req.body;

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CO");
    const hora = ahora.toLocaleTimeString("es-CO");


    db.query(
        `INSERT INTO ventas 
        (codigo, valor, pago, fecha, hora)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id`,
        [codigo, valor, pago, fecha, hora],

        (err, resultado) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }


            res.json({
                ok: true,
                id: resultado.rows[0].id
            });

        }
    );

}



function obtenerVenta(req,res){

    db.query(
        `SELECT * FROM ventas WHERE id=$1`,
        [req.params.id],

        (err, resultado)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(resultado.rows[0]);

        }
    );

}



function actualizarVenta(req,res){

    const {codigo, valor, pago}=req.body;


    db.query(
        `UPDATE ventas
        SET codigo=$1,
            valor=$2,
            pago=$3
        WHERE id=$4`,

        [
            codigo,
            valor,
            pago,
            req.params.id
        ],

        (err)=>{

            if(err){
                return res.status(500).json(err);
            }


            res.json({
                ok:true
            });

        }
    );

}



function eliminarVenta(req,res){

    db.query(
        `DELETE FROM ventas WHERE id=$1`,
        [req.params.id],

        (err)=>{

            if(err){
                return res.status(500).json(err);
            }


            res.json({
                ok:true
            });

        }
    );

}
function totalVentasHoy(req, res) {

    const hoy = new Date().toLocaleDateString("es-CO");


    db.query(
        `SELECT COALESCE(SUM(valor),0) AS total
         FROM ventas
         WHERE fecha=$1`,
        [hoy],

        (err, resultado)=>{

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }


            res.json(resultado.rows[0]);

        }
    );

}



function resumenHoy(req,res){

    const hoy = new Date().toLocaleDateString("es-CO");


    db.query(
        `SELECT COALESCE(SUM(valor),0) AS total
         FROM ventas
         WHERE fecha=$1`,
        [hoy],

        (err, ventas)=>{

            if(err){
                return res.status(500).json(err);
            }


            db.query(
                `SELECT COALESCE(SUM(valor),0) AS total
                 FROM gastos
                 WHERE fecha=$1`,
                [hoy],

                (err2,gastos)=>{

                    if(err2){
                        return res.status(500).json(err2);
                    }


                    res.json({

                        ventas:Number(ventas.rows[0].total),

                        gastos:Number(gastos.rows[0].total),

                        ganancia:
                        Number(ventas.rows[0].total) -
                        Number(gastos.rows[0].total)

                    });


                }
            );


        }
    );

}



function resumenSemana(req,res){

    const hoy = new Date();

    let diaSemana = hoy.getDay();

    if(diaSemana===0) diaSemana=7;


    const lunes = new Date(hoy);

    lunes.setHours(0,0,0,0);

    lunes.setDate(
        hoy.getDate()-(diaSemana-1)
    );


    const fechas=[];

    const actual=new Date(lunes);


    while(actual<=hoy){

        fechas.push(
            `${actual.getDate()}/${actual.getMonth()+1}/${actual.getFullYear()}`
        );

        actual.setDate(actual.getDate()+1);

    }


    db.query(
        `SELECT COALESCE(SUM(valor),0) AS total
         FROM ventas
         WHERE fecha = ANY($1)`,

        [fechas],

        (err,ventas)=>{

            if(err){
                return res.status(500).json(err);
            }


            db.query(
                `SELECT COALESCE(SUM(valor),0) AS total
                 FROM gastos
                 WHERE fecha = ANY($1)`,

                [fechas],

                (err2,gastos)=>{


                    if(err2){
                        return res.status(500).json(err2);
                    }


                    res.json({

                        ventas:Number(ventas.rows[0].total),

                        gastos:Number(gastos.rows[0].total),

                        ganancia:
                        Number(ventas.rows[0].total) -
                        Number(gastos.rows[0].total)

                    });


                }
            );


        }
    );

}
function resumenMes(req,res){

    const hoy = new Date();

    const mes = hoy.getMonth()+1;
    const año = hoy.getFullYear();


    db.query(
        `SELECT valor,fecha FROM ventas`,

        (err, ventas)=>{

            if(err){
                return res.status(500).json(err);
            }


            db.query(
                `SELECT valor,fecha FROM gastos`,

                (err2,gastos)=>{


                    if(err2){
                        return res.status(500).json(err2);
                    }


                    let totalVentas=0;
                    let totalGastos=0;


                    ventas.rows.forEach(v=>{

                        const p=v.fecha.split("/");

                        if(
                            Number(p[1])===mes &&
                            Number(p[2])===año
                        ){

                            totalVentas += Number(v.valor);

                        }

                    });



                    gastos.rows.forEach(g=>{

                        const p=g.fecha.split("/");


                        if(
                            Number(p[1])===mes &&
                            Number(p[2])===año
                        ){

                            totalGastos += Number(g.valor);

                        }

                    });



                    res.json({

                        ventas:totalVentas,

                        gastos:totalGastos,

                        ganancia:
                        totalVentas-totalGastos

                    });


                }
            );


        }
    );

}




function historial(req,res){

    db.query(
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


        ORDER BY fecha DESC,hora DESC
        `,

        (err,resultado)=>{


            if(err){

                return res.status(500).json({
                    error:err.message
                });

            }


            res.json(resultado.rows);


        }
    );

}




function buscarPorFecha(req,res){


    const partes=req.params.fecha.split("-");


    const año=Number(partes[0]);
    const mes=Number(partes[1]);
    const dia=Number(partes[2]);


    const fecha=`${dia}/${mes}/${año}`;



    db.query(
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

        [fecha],

        (err,resultado)=>{


            if(err){

                return res.status(500).json({
                    error:err.message
                });

            }


            res.json(resultado.rows);


        }
    );

}
function estadisticas(req,res){

    const hoy = new Date();

    const mes = hoy.getMonth()+1;
    const año = hoy.getFullYear();



    db.query(
        `SELECT * FROM ventas`,

        (err, ventas)=>{


            if(err){
                return res.status(500).json(err);
            }



            db.query(
                `SELECT * FROM gastos`,

                (err2,gastos)=>{


                    if(err2){
                        return res.status(500).json(err2);
                    }



                    let ventasMes=[];
                    let gastosMes=[];



                    ventas.rows.forEach(v=>{

                        const p=v.fecha.split("/");


                        if(
                            Number(p[1])===mes &&
                            Number(p[2])===año
                        ){

                            ventasMes.push(v);

                        }

                    });



                    gastos.rows.forEach(g=>{

                        const p=g.fecha.split("/");


                        if(
                            Number(p[1])===mes &&
                            Number(p[2])===año
                        ){

                            gastosMes.push(g);

                        }

                    });



                    const totalVentas =
                    ventasMes.reduce(
                        (a,b)=>a+Number(b.valor),
                        0
                    );


                    const totalGastos =
                    gastosMes.reduce(
                        (a,b)=>a+Number(b.valor),
                        0
                    );



                    const promedioVenta =
                    ventasMes.length===0
                    ?0
                    :totalVentas/ventasMes.length;



                    const codigos={};



                    ventasMes.forEach(v=>{

                        if(!codigos[v.codigo]){

                            codigos[v.codigo]={
                                cantidad:0,
                                total:0
                            };

                        }


                        codigos[v.codigo].cantidad++;

                        codigos[v.codigo].total += Number(v.valor);


                    });



                    let codigoMasVendido="-";
                    let cantidadMayor=0;

                    let codigoMasDinero="-";
                    let dineroMayor=0;



                    Object.keys(codigos).forEach(codigo=>{


                        if(
                            codigos[codigo].cantidad >
                            cantidadMayor
                        ){

                            cantidadMayor =
                            codigos[codigo].cantidad;

                            codigoMasVendido=codigo;

                        }



                        if(
                            codigos[codigo].total >
                            dineroMayor
                        ){

                            dineroMayor =
                            codigos[codigo].total;

                            codigoMasDinero=codigo;

                        }


                    });



                    res.json({

                        ventasMes:totalVentas,

                        gastosMes:totalGastos,

                        gananciaMes:
                        totalVentas-totalGastos,

                        numeroVentas:
                        ventasMes.length,

                        numeroGastos:
                        gastosMes.length,

                        promedioVenta,

                        codigoMasVendido,

                        cantidadMayor,

                        codigoMasDinero,

                        dineroMayor

                    });


                }
            );


        }
    );

}




function estadisticasMes(req,res){

    const mes = Number(req.params.mes);

    const año = Number(req.params.anio);



    const filtrar=(fecha)=>{

        const partes=fecha.split("/");


        return (
            Number(partes[1])===mes &&
            Number(partes[2])===año
        );

    };



    db.query(
        `SELECT * FROM ventas`,

        (err,ventas)=>{


            if(err){
                return res.status(500).json(err);
            }



            db.query(
                `SELECT * FROM gastos`,

                (err2,gastos)=>{


                    if(err2){
                        return res.status(500).json(err2);
                    }



                    const ventasMes =
                    ventas.rows.filter(
                        v=>filtrar(v.fecha)
                    );


                    const gastosMes =
                    gastos.rows.filter(
                        g=>filtrar(g.fecha)
                    );



                    const totalVentas =
                    ventasMes.reduce(
                        (a,b)=>a+Number(b.valor),
                        0
                    );


                    const totalGastos =
                    gastosMes.reduce(
                        (a,b)=>a+Number(b.valor),
                        0
                    );



                    res.json({

                        ventas:totalVentas,

                        gastos:totalGastos,

                        ganancia:
                        totalVentas-totalGastos,

                        numeroVentas:
                        ventasMes.length,

                        numeroGastos:
                        gastosMes.length,

                        promedioVenta:
                        ventasMes.length
                        ? totalVentas/ventasMes.length
                        :0,

                        codigoMasVendido:"-",

                        cantidadMayor:0,

                        codigoMasDinero:"-",

                        dineroMayor:0

                    });


                }
            );


        }
    );

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