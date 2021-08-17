var express = require("express");

var app = express();

var Usuario = require("../models/usuario");
var Indicadores = require("../models/indicadores");
const { validarJWT } = require('../middlewares/validar-jwt');
// ==============================
// Busqueda por colección
// ==============================
app.get("/coleccion/:tabla/:busqueda", (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, "i");

    var promesa;

    switch (tabla) {
        case "usuarios":
            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje:
                    "Los tipos de busqueda sólo son: usuarios, proveedores y lista de informes comerciales",
                error: { message: "Tipo de tabla/coleccion no válido" },
            });
    }

    promesa.then((data) => {
        res.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });
});

// ==============================
// Busqueda indicadores
// ==============================
app.get("/indicadores/:busqueda", validarJWT, async (req, res = response) => {
    try {
        let indicadores = await Indicadores.aggregate([
            {
                $lookup: {
                    from: "responsables",
                    localField: "responde",
                    foreignField: "_id",
                    as: "responde",
                },
            },
            { $unwind: "$responde" },
            {
                $lookup: {
                    from: "unidades",
                    localField: "unidad",
                    foreignField: "_id",
                    as: "unidad",
                },
            },
            { $unwind: "$unidad" },
            {
                $lookup: {
                    from: "macroprocesos",
                    localField: "macroProceso",
                    foreignField: "_id",
                    as: "macroProceso",
                },
            },
            { $unwind: "$macroProceso" },
            {
                $match: {
                    $or: [
                        { "responde.responde": new RegExp(req.params.busqueda, "i") },
                        { "unidad.unidad": new RegExp(req.params.busqueda, "i") },
                        { "macroProceso.macroProceso": new RegExp(req.params.busqueda, "i") }
                    ]
                }
            }
        ])

        res.json({
            ok: true,
            indicadores: indicadores,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            err: error,
            msg: "Error comuniquese con el administrador",
        });
    }
});

// ==============================
// Busqueda general
// ==============================
app.get("/todo/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");

    Promise.all([
        buscarUsuarios(busqueda, regex),
        buscarIndicadores(busqueda, regex),
    ]).then((respuestas) => {
        res.status(200).json({
            ok: true,

            usuarios: respuestas[1],
        });
    });
});

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "usuario email role img")
            .or([{ usuario: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Erro al cargar usuarios", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;
