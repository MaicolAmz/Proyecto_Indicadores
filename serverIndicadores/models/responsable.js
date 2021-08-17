const mongoose = require('mongoose');

const ResponsableSchema = mongoose.Schema({

    responde:  String,
   

})

module.exports = mongoose.model('Responsable',ResponsableSchema);