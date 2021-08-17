const { Router } = require('express');

const Macro = require('../controllers/macroProceso')

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//informe largo
router.post('/', validarJWT, Macro.crearMacroProceso);
router.get('/', validarJWT, Macro.getMacroProceso);





module.exports = router;