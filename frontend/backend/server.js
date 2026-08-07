const express = require("express");
const cors = require("cors");

const {
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
} = require("./controllers/ventasController");


const {
    guardarGasto,
    obtenerGasto,
    actualizarGasto,
    totalGastosHoy,
    eliminarGasto
} = require("./controllers/gastosController");


const db = require("./database");


const app = express();


app.use(cors());
app.use(express.json());


// PRUEBA SERVIDOR

app.get("/", (req,res)=>{
    res.json({
        mensaje:"Servidor Vivekfe funcionando correctamente"
    });
});



// VENTAS

app.post("/ventas", guardarVenta);

app.get("/ventas/:id", obtenerVenta);

app.put("/ventas/:id", actualizarVenta);

app.delete("/ventas/:id", eliminarVenta);

app.get("/ventas/hoy", totalVentasHoy);



// GASTOS

app.post("/gastos", guardarGasto);

app.get("/gastos/:id", obtenerGasto);

app.put("/gastos/:id", actualizarGasto);

app.get("/gastos/hoy", totalGastosHoy);

app.delete("/gastos/:id", eliminarGasto);



// RESUMEN

app.get("/resumen/hoy", resumenHoy);

app.get("/resumen/semana", resumenSemana);

app.get("/resumen/mes", resumenMes);



// ESTADISTICAS

app.get("/estadisticas", estadisticas);


app.get("/estadisticas/mes/:mes/:anio", (req,res)=>{
    console.log("MES RECIBIDO:", req.params);
    estadisticasMes(req,res);
});



// HISTORIAL

app.get("/historial", historial);

app.get("/historial/:fecha", buscarPorFecha);



// DEBUG TABLA GASTOS

app.get("/debug-gastos", async (req,res)=>{

    try{

        const resultado = await db.query(
            `
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name='gastos'
            `
        );

        res.json(resultado.rows);

    }catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }

});



// PRUEBA INSERTAR GASTO DIRECTAMENTE

app.get("/debug-insert-gasto", async(req,res)=>{

    try{

        const resultado = await db.query(
            `
            INSERT INTO gastos
            (descripcion, valor, fecha, hora)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                "Prueba desde debug",
                1000,
                "7/8/2026",
                "12:00"
            ]
        );


        res.json(resultado.rows[0]);


    }catch(error){

        console.log("ERROR DEBUG GASTO:",error);

        res.status(500).json({
            error:error.message
        });

    }

});




// INICIAR SERVIDOR

const PORT = 3001;


app.listen(PORT,"0.0.0.0",()=>{

    console.log(
        "Servidor iniciado en puerto " + PORT
    );

});