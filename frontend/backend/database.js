const { Pool } = require("pg");



const db = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized:false
    }

});





async function conectarBaseDatos(){


    try{


        await db.connect();

        console.log("Base de datos PostgreSQL conectada.");



        await crearTablas();



    }catch(error){


        console.error(
            "Error conectando PostgreSQL:",
            error.message
        );


    }


}





async function crearTablas(){


try{


await db.query(`

CREATE TABLE IF NOT EXISTS ventas (

    id SERIAL PRIMARY KEY,

    codigo TEXT NOT NULL,

    valor REAL NOT NULL,

    pago TEXT NOT NULL,

    fecha TEXT NOT NULL,

    hora TEXT NOT NULL

);



CREATE TABLE IF NOT EXISTS gastos (

    id SERIAL PRIMARY KEY,

    descripcion TEXT NOT NULL,

    valor REAL NOT NULL,

    fecha TEXT NOT NULL,

    hora TEXT NOT NULL

);



CREATE TABLE IF NOT EXISTS categorias (

    codigo TEXT PRIMARY KEY,

    nombre TEXT NOT NULL

);



CREATE INDEX IF NOT EXISTS idx_ventas_fecha

ON ventas(fecha);



CREATE INDEX IF NOT EXISTS idx_gastos_fecha

ON gastos(fecha);



`);



console.log("Tablas verificadas.");



}catch(error){


console.error(

"Error creando tablas:",

error.message

);


}



}





conectarBaseDatos();





module.exports = db;