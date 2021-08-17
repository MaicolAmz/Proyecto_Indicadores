const mongoose = require('mongoose');

const UnidadesrectoradosSchema = mongoose.Schema({

    campos: Array,
    resultado: Array


})

module.exports = mongoose.model('Unidadesrectorados',UnidadesrectoradosSchema);