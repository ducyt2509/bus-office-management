const transports = require('../controllers').transport;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post(
  '/transport/add-transport',
  middleWare.verifyTokenForManager,
  transports.addNewTransport
);
router.post(
  '/transport/list-transport',
  middleWare.verifyTokenForManager,
  transports.getListTransport
);
router.delete(
  '/transport/delete-transport',
  middleWare.verifyTokenForManager,
  transports.deleteTransport
);
router.put(
  '/transport/update-transport',
  middleWare.verifyTokenForDriver,
  transports.updateTransport
);
router.post(
  '/transport/get-transport-by-id',
  middleWare.verifyTokenForDriver,
  transports.getTransportById
);
module.exports = router;
