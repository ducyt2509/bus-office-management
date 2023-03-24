const transports = require('../controllers').transport;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');



router.post('/transport/add-transport', transports.addNewTransport);
router.post('/transport/list-transport', transports.getListTransport);
// router.delete('/transport/delete-transport', transports.deleteTransport);
// router.put('/transport/update-transport', transports.updateTransport);
module.exports = router;
