const { Router } = require('express');

const Indicador = require('../controllers/indicadores');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//informe largo
router.post('/', validarJWT, Indicador.creaIndicador);
//Todos Indicadores
router.post('/todos', validarJWT, Indicador.allCreaIndicador);

router.get('/', validarJWT, Indicador.getIndicadorId);
router.get('/todos', validarJWT, Indicador.getIndicador);
//Filtros
router.get('/filtros', validarJWT, Indicador.filtrosIndicadores);
//Descargar Archivo
router.get('/descargar', validarJWT, Indicador.descargarFileIndicador);
router.get('/:_id', validarJWT, Indicador.getIdIndicador);
router.put('/', validarJWT, Indicador.actualizarIndicadores);
router.delete('/:_id', validarJWT, Indicador.eliminarIndicador);

//Eliminar varios
router.post('/deleteAll', validarJWT, Indicador.deleteIndicadoresVarios);
//archivos



module.exports = router;