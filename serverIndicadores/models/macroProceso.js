const mongoose = require('mongoose');

const MacroProcesosSchema = mongoose.Schema({

    macroProceso:  String,
   

})

module.exports = mongoose.model('MacroProcesos',MacroProcesosSchema);