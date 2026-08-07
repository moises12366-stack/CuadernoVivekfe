const db = require("../database");

function guardarVenta(req, res) {

    const { codigo, valor, pago } = req.body;

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CO");

    const hora = ahora.toLocaleTimeString("es-CO");

    db.run(

        `INSERT INTO ventas (codigo,valor,pago,fecha,hora)
         VALUES(?,?,?,?,?)`,

        [codigo, valor, pago, fecha, hora],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                ok: true,

                id: this.lastID

            });

        }

    );

}


function obtenerVenta(req, res){

    db.get(

        `SELECT * FROM ventas WHERE id=?`,

        [req.params.id],

        (err,fila)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(fila);

        }

    );

}


function actualizarVenta(req,res){

    const {codigo,valor,pago}=req.body;

    db.run(

        `UPDATE ventas
         SET codigo=?,
             valor=?,
             pago=?
         WHERE id=?`,

        [

            codigo,

            valor,

            pago,

            req.params.id

        ],

        function(err){

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

    db.get(

        `SELECT IFNULL(SUM(valor),0) total
         FROM ventas
         WHERE fecha=?`,

        [hoy],

        (err, fila) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(fila);

        }

    );

}
function resumenHoy(req, res) {

    const hoy = new Date().toLocaleDateString("es-CO");

    db.serialize(() => {

        db.get(

            `SELECT IFNULL(SUM(valor),0) total
             FROM ventas
             WHERE fecha=?`,

            [hoy],

            (err, ventas) => {

                if (err) {

                    return res.status(500).json(err);

                }


                db.get(

                    `SELECT IFNULL(SUM(valor),0) total
                     FROM gastos
                     WHERE fecha=?`,

                    [hoy],

                    (err2, gastos) => {

                        if (err2) {

                            return res.status(500).json(err2);

                        }


                        res.json({

                            ventas: ventas.total,

                            gastos: gastos.total,

                            ganancia: ventas.total - gastos.total

                        });


                    }

                );


            }

        );

    });

}



function resumenSemana(req, res) {


    const hoy = new Date();


    let diaSemana = hoy.getDay();


    if (diaSemana === 0) diaSemana = 7;


    const lunes = new Date(hoy);


    lunes.setHours(0,0,0,0);


    lunes.setDate(hoy.getDate() - (diaSemana - 1));


    const fechas = [];


    const actual = new Date(lunes);


    while(actual <= hoy){


        fechas.push(

            `${actual.getDate()}/${actual.getMonth()+1}/${actual.getFullYear()}`

        );


        actual.setDate(actual.getDate()+1);


    }


    const signos = fechas.map(()=>"?").join(",");



    db.get(

        `SELECT IFNULL(SUM(valor),0) total
         FROM ventas
         WHERE fecha IN (${signos})`,

        fechas,


        (err, ventas)=>{


            if(err){

                return res.status(500).json(err);

            }



            db.get(

                `SELECT IFNULL(SUM(valor),0) total
                 FROM gastos
                 WHERE fecha IN (${signos})`,

                fechas,


                (err2, gastos)=>{


                    if(err2){

                        return res.status(500).json(err2);

                    }



                    res.json({

                        ventas:Number(ventas.total),

                        gastos:Number(gastos.total),

                        ganancia:Number(ventas.total)-Number(gastos.total)

                    });


                }

            );


        }

    );


}
function resumenMes(req, res) {

    const hoy = new Date();

    const mes = hoy.getMonth() + 1;

    const año = hoy.getFullYear();


    db.all(

        `SELECT valor,fecha FROM ventas`,

        [],

        (err, ventas)=>{


            if(err){

                return res.status(500).json(err);

            }


            db.all(

                `SELECT valor,fecha FROM gastos`,

                [],

                (err2,gastos)=>{


                    if(err2){

                        return res.status(500).json(err2);

                    }


                    let totalVentas = 0;

                    let totalGastos = 0;



                    ventas.forEach(v=>{


                        const p = v.fecha.split("/");


                        if(

                            Number(p[1]) === mes &&

                            Number(p[2]) === año

                        ){

                            totalVentas += Number(v.valor);

                        }


                    });



                    gastos.forEach(g=>{


                        const p = g.fecha.split("/");


                        if(

                            Number(p[1]) === mes &&

                            Number(p[2]) === año

                        ){

                            totalGastos += Number(g.valor);

                        }


                    });



                    res.json({

                        ventas: totalVentas,

                        gastos: totalGastos,

                        ganancia: totalVentas - totalGastos

                    });


                }

            );


        }

    );


}



function historial(req,res){


    db.all(

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


        [],


        (err,filas)=>{


            if(err){

                return res.status(500).json({

                    error: err.message

                });

            }


            res.json(filas);


        }


    );


}
function buscarPorFecha(req,res){


    const partes = req.params.fecha.split("-");


    const año = Number(partes[0]);

    const mes = Number(partes[1]);

    const dia = Number(partes[2]);


    const fecha = `${dia}/${mes}/${año}`;



    db.all(

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

        WHERE fecha=?


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

        WHERE fecha=?


        ORDER BY hora DESC

        `,


        [fecha,fecha],


        (err,filas)=>{


            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }


            res.json(filas);


        }


    );


}



function eliminarVenta(req,res){


    db.run(

        `DELETE FROM ventas WHERE id=?`,


        [req.params.id],


        function(err){


            if(err){

                return res.status(500).json(err);

            }


            res.json({

                ok:true

            });


        }


    );


}
function estadisticas(req,res){


    const hoy = new Date();


    const mes = hoy.getMonth()+1;

    const año = hoy.getFullYear();



    db.all(

        `SELECT * FROM ventas`,

        [],


        (err,ventas)=>{


            if(err){

                return res.status(500).json(err);

            }



            db.all(

                `SELECT * FROM gastos`,

                [],


                (err2,gastos)=>{


                    if(err2){

                        return res.status(500).json(err2);

                    }



                    let ventasMes=[];

                    let gastosMes=[];



                    ventas.forEach(v=>{


                        const p=v.fecha.split("/");


                        if(

                            Number(p[1])===mes &&

                            Number(p[2])===año

                        ){

                            ventasMes.push(v);

                        }


                    });



                    gastos.forEach(g=>{


                        const p=g.fecha.split("/");


                        if(

                            Number(p[1])===mes &&

                            Number(p[2])===año

                        ){

                            gastosMes.push(g);

                        }


                    });



                    const totalVentas = ventasMes.reduce(

                        (a,b)=>a+Number(b.valor),

                        0

                    );



                    const totalGastos = gastosMes.reduce(

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


                        if(codigos[codigo].cantidad>cantidadMayor){


                            cantidadMayor=codigos[codigo].cantidad;

                            codigoMasVendido=codigo;


                        }



                        if(codigos[codigo].total>dineroMayor){


                            dineroMayor=codigos[codigo].total;

                            codigoMasDinero=codigo;


                        }


                    });



                    res.json({


                        ventasMes:totalVentas,

                        gastosMes:totalGastos,

                        gananciaMes:totalVentas-totalGastos,

                        numeroVentas:ventasMes.length,

                        numeroGastos:gastosMes.length,

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


    const filtrar = (fecha)=>{

        const partes = fecha.split("/");

        return (

            Number(partes[1]) === mes &&
            Number(partes[2]) === año

        );

    };


    db.all(

        `SELECT * FROM ventas`,

        [],

        (err,ventas)=>{


            if(err){

                return res.status(500).json(err);

            }



            db.all(

                `SELECT * FROM gastos`,

                [],

                (err2,gastos)=>{


                    if(err2){

                        return res.status(500).json(err2);

                    }


                    const ventasMes = ventas.filter(v=>filtrar(v.fecha));

                    const gastosMes = gastos.filter(g=>filtrar(g.fecha));



                    const totalVentas = ventasMes.reduce(

                        (a,b)=>a + Number(b.valor),

                        0

                    );


                    const totalGastos = gastosMes.reduce(

                        (a,b)=>a + Number(b.valor),

                        0

                    );



                    res.json({

                        ventas: totalVentas,

                        gastos: totalGastos,

                        ganancia: totalVentas-totalGastos,

                        numeroVentas: ventasMes.length,

                        numeroGastos: gastosMes.length,

                        promedioVenta:

                            ventasMes.length

                            ? totalVentas / ventasMes.length

                            : 0,


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