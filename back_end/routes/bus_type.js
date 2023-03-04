const bus_types = require('../controllers').bus_type;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/bus-type/list-bus-type', bus_types.getListBusType);
router.delete(
  '/bus-type/delete-bus-type',
  middleWare.verifyTokenForManager,
  bus_types.deleteBusType
);
router.post('/bus-type/add-bus-type', middleWare.verifyTokenForManager, bus_types.addNewBusType);
router.put('/bus-type/update-bus-type', middleWare.verifyTokenForManager, bus_types.updateBusType);

module.exports = router;
