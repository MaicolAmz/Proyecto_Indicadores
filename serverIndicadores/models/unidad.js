const mongoose = require('mongoose');

const UnidadesSchema = mongoose.Schema({

    unidad:  String,
   

})

module.exports = mongoose.model('Unidades',UnidadesSchema);