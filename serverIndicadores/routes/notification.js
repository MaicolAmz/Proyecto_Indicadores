const { Router } = require('express');

const Notification = require('../controllers/notification')

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/', validarJWT, Notification.creaNotification);
router.get('/', validarJWT, Notification.getNotificationId);
//All usuer UPDI
router.get('/updi', validarJWT, Notification.getAllUPDI);
router.put('/', validarJWT, Notification.actualizarNotificationes);
router.delete('/:_id', validarJWT, Notification.eliminarNotification);


module.exports = router;