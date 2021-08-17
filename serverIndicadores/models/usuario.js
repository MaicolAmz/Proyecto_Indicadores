
const mongoose = require('mongoose');

                              
var rolesValidos = {
   values: ['ADMIN_ROLE', 'USER_ROLE', 'RECTOR_ROLE', 'VICERECTOR_ROLE', 'DIRECTOR_ROLE', 'PLANIFICADOR_ROLE', 
   'UPDI_ROLE', 'INACTIVO','REQUIRENTE_ROLE','PRESUPUESTO_ROLE','DIRECTOR_UPDI_ROLE','VICERECTOR_ADMINISTRATIVO_ROLE','VICERECTOR_ACADEMICO__GENERAL_ROLE' ],
   message: '{VALUE} no es un rol permitido'
};


const UsuarioSchema = mongoose.Schema({

   nombre: { type: String },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true, },
   img: { type: String },
   role: {
      type: String,
      required: true,
      default: 'USER_ROLE',
      enum: rolesValidos
   },


});


/* UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})  */



module.exports = mongoose.model('Usuario', UsuarioSchema);
