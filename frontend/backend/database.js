const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect()
.then(() => {
    console.log("Base de datos PostgreSQL conectada.");
})
.catch((err) => {
    console.error("Error conectando PostgreSQL:", err);
});


db.query(`
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
`)
.then(() => {
    console.log("Tablas verificadas.");
})
.catch(err => {
    console.error("Error creando tablas:", err);
});


module.exports = db;