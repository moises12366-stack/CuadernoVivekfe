const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./vivekfe.db", (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    } else {
        console.log("Base de datos conectada.");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            valor REAL NOT NULL,
            pago TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS gastos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL,
            valor REAL NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS categorias (
            codigo TEXT PRIMARY KEY,
            nombre TEXT NOT NULL
        )
    `);

});

module.exports = db;