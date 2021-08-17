var express = require('express');


const Departamentos = require('../models/departamento');



// todos las opciones
const getDepartamentoId = (req, res) => {
   Departamentos.find({ campus: req.query.campus })
        .then(departamento => {
            res.json(departamento);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};


module.exports = {

    getDepartamentoId

}