const { Router } = require('express');

const unidad = require('../controllers/unidad')

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

//informe largo
router.post('/', validarJWT, unidad.crearUnidad);
router.get('/', validarJWT, unidad.getUnidades);





module.exports = router;