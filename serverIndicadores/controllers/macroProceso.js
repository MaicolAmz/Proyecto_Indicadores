


const Macro = require('../models/macroProceso');



// POST CREAR CLIENTE
const crearMacroProceso = (req, res) => {
    // Crear un cliente
    const macro = new Macro(req.body);

    // GUARDAR UNA OPCION EN MongoDB
    macro.save()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            });
        });
};


// todos las opciones
const getMacroProceso = (req, res) => {
    Macro.find()
        .then(macro => {
            res.json(macro);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};




// ACTUALIZAR OPCION
const actualizarMacroProceso =  (req, res) => {
    //Encuentra un cliente y actualízalo
    Macro.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then(opcionesGenerales => {
            if (!opcionesGenerales) {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params.opcionesGeneralesId
                });
            }
            res.json(opcionesGenerales);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params.opcionesGeneralesId
                });
            }
            return res.status(500).json({
                msg: "Error updating opciones with id " + req.params.opcionesGeneralesId
            });
        });
};

//ELIMINAR OPCION
const eliminarMacroProceso = (req, res) => {
    Macro.findByIdAndRemove(req.params.opcionesGneralesId)
        .then(opcionesGenerales => {
            if (!opcionesGenerales) {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params.opcionesGeneralesId
                });
            }
            res.json({ msg: "Opciones deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params.opcionesGeneralesId
                });
            }
            return res.status(500).json({
                msg: "Could not delete opciones with id " + req.params.opcionesGeneralesId
            });
        });
};


module.exports = {

    crearMacroProceso ,
    getMacroProceso,
    actualizarMacroProceso,
    eliminarMacroProceso 
 
}