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

require("./database");

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

app.post("/ventas", async (req,res)=>{
    try {
        await guardarVenta(req,res);
    } catch(error){
        console.log("ERROR VENTA:", error);

        res.status(500).json({
            error:"Error al guardar la venta",
            detalle:error.message
        });
    }
});


app.get("/ventas/:id", obtenerVenta);

app.put("/ventas/:id", actualizarVenta);

app.delete("/ventas/:id", eliminarVenta);

app.get("/ventas/hoy", totalVentasHoy);



// GASTOS

app.post("/gastos", async (req,res)=>{
    try {
        await guardarGasto(req,res);
    } catch(error){
        console.log("ERROR GASTO:", error);

        res.status(500).json({
            error:"Error al guardar el gasto",
            detalle:error.message
        });
    }
});


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



const PORT = 3001;

app.listen(PORT, "0.0.0.0", ()=>{
    console.log(
        "Servidor iniciado en puerto " + PORT
    );
});
app.get("/debug-gastos", async (req,res)=>{

    const db = require("./database");

    db.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='gastos'",
        (err, resultado)=>{

            if(err){

                return res.json({
                    error: err.message
                });

            }


            res.json(resultado.rows);

        }
    );

});