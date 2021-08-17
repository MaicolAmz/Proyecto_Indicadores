


const Unidades = require('../models/unidad');



// POST CREAR CLIENTE
const crearUnidad = (req, res) => {
    // Crear un cliente
    const unidades = new Unidades(req.body);

    // GUARDAR UNA OPCION EN MongoDB
    unidades.save()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            });
        });
};


// todos las opciones
const getUnidades = (req, res) => {
    Unidades.find()
        .then(unidad => {
            res.json(unidad);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};




// ACTUALIZAR OPCION
const actualizarUnidad =  (req, res) => {
    //Encuentra un cliente y actualízalo
    Unidades.findByIdAndUpdate(req.body._id, req.body, { new: true })
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
const eliminarUnidad = (req, res) => {
    Unidades.findByIdAndRemove(req.params.opcionesGneralesId)
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

    crearUnidad,
    getUnidades,
    actualizarUnidad,
    eliminarUnidad 
 
}