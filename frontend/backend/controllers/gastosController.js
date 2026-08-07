const db = require("../database");

function guardarGasto(req, res) {

    const { descripcion, valor } = req.body;

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CO");
    const hora = ahora.toLocaleTimeString("es-CO");

    db.run(
        `INSERT INTO gastos (descripcion,valor,fecha,hora)
         VALUES(?,?,?,?)`,
        [descripcion, valor, fecha, hora],
        function (err) {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                ok: true,
                id: this.lastID
            });

        }
    );

}

function obtenerGasto(req, res) {

    db.get(

        `SELECT * FROM gastos WHERE id=?`,

        [req.params.id],

        (err, fila) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(fila);

        }

    );

}

function actualizarGasto(req, res) {

    const { descripcion, valor } = req.body;

    db.run(

        `UPDATE gastos
         SET descripcion=?,
             valor=?
         WHERE id=?`,

        [

            descripcion,

            valor,

            req.params.id

        ],

        function (err) {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({
                ok: true
            });

        }

    );

}

function totalGastosHoy(req, res) {

    const hoy = new Date().toLocaleDateString("es-CO");

    db.get(

        `SELECT IFNULL(SUM(valor),0) total
         FROM gastos
         WHERE fecha=?`,

        [hoy],

        (err, fila) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(fila);

        }

    );

}

function eliminarGasto(req, res) {

    db.run(

        `DELETE FROM gastos WHERE id=?`,

        [req.params.id],

        function (err) {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({
                ok: true
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