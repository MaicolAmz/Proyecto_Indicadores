const mongoose = require('mongoose');

const DepartamentosSchema = mongoose.Schema({

    campus: String,
    departamento: String
  
   

})

module.exports = mongoose.model('departamentos',DepartamentosSchema);