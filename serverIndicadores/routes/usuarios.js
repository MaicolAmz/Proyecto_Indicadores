/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

const { getUsuarios, crearUsuario, actualizarUsuarioPlan, borrarUsuario, actualizarUser, usuariosAdmin, actualizarUsuarioAdmin, deleteUser } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosAdmin);
router.get('/', getUsuarios);

router.post('/',
    crearUsuario
);

router.put('/',
    actualizarUser
);

router.put('/:id',
    actualizarUsuarioAdmin
);
router.put('/plan',
    actualizarUsuarioPlan
);


router.delete('/:id',
    mdAutenticacion.verificaToken,
    borrarUsuario
);

router.delete('/:id',

    deleteUser
);



module.exports = router;