const { Router } = require('express');

const UnidadesRectorados = require('../controllers/unidadesRectorado')
const Departamento = require('../controllers/departamentos')

const router = Router();

//informe largo
router.post('/',UnidadesRectorados.creaUnidadesRectorado);
//departamento
router.get('/departamento/',Departamento.getDepartamentoId);

router.get('/',UnidadesRectorados.getUnidadesRectoradoId);
router.get('/todos',UnidadesRectorados.getUnidadesRectorado );
router.get('/:_id',UnidadesRectorados.getIdUnidadesRectorado);
router.put('/',UnidadesRectorados.actualizarUnidadesRectorado);
router.delete('/:_id',UnidadesRectorados.eliminarUnidadesRectorado);
//archivos



module.exports = router;