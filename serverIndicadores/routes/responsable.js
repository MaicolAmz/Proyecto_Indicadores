const { Router } = require('express');

const Responsable = require('../controllers/responsable')

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

//informe largo
router.post('/', validarJWT, Responsable.crearResponsable);
router.get('/', validarJWT, Responsable.getResponder);





module.exports = router;