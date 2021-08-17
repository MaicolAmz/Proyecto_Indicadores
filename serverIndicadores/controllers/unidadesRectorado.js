var express = require('express');


const UnidadesRectorados = require('../models/unidadesRectorados');



// POST CREAR CLIENTE
const creaUnidadesRectorado = (req, res) => {
    // Crear un cliente
    const unidadesRectorado = new UnidadesRectorados(req.body);

    // GUARDAR UNA OPCION EN MongoDB
    unidadesRectorado.save()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            });
        });
};


// todos las opciones
const getUnidadesRectorado = (req, res) => {
    UnidadesRectorados.find({}).populate('usuario img')
        .then(unidadesRectorado => {
            res.json(unidadesRectorado);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};



// todos las opciones
const getUnidadesRectoradoId = (req, res) => {
    UnidadesRectorados.find({usuario:req.query.usuario_id})

    .populate('usuario ')
        .then(unidadesRectorado => {
            res.json(unidadesRectorado);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};


//ENCUENTRE UNA OPCION
const getIdUnidadesRectorado=  (req, res) => {
    UnidadesRectorados.findById(req.params._id)
        .then(unidadesRectorado => {
            if (!unidadesRectorado) {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            res.json(unidadesRectorado);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            return res.status(500).json({
                msg: "Error retrieving Opciones with id " + req.params._id
            });
        });
};

// ACTUALIZAR OPCIÓN
const actualizarUnidadesRectorado =  (req, res) => {
    //Encuentra un cliente y actualízalo
    UnidadesRectorados.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then(unidadesRectorado => {
            if (!unidadesRectorado) {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            res.json(unidadesRectorado);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            return res.status(500).json({
                msg: "Error updating opciones with id " + req.params._id
            });
        });
};






//ELIMINAR OPCIÓN
const eliminarUnidadesRectorado = (req, res) => {
    UnidadesRectorados.findByIdAndDelete(req.params._id)
        .then(unidadesRectorado => {
            if (!unidadesRectorado) {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            res.json({ msg: "Opciones deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    msg: "Opciones not found with id " + req.params._id
                });
            }
            return res.status(500).json({
                msg: "Could not delete opciones with id " + req.params._id
            });
        });
};


module.exports = {

    creaUnidadesRectorado,
    getUnidadesRectorado,
    getUnidadesRectoradoId,
    getIdUnidadesRectorado,
    actualizarUnidadesRectorado,
    eliminarUnidadesRectorado

}