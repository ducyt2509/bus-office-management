const bus_types = require('../controllers').bus_type;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/list-bus-type', bus_types.getListBusType);
router.delete('/admin/delete-bus-type', middleWare.verifyTokenForManager, bus_types.deleteBusType);
router.post('/admin/add-bus-type', middleWare.verifyTokenForManager, bus_types.addNewBusType);
router.put('/admin/update-bus-type', middleWare.verifyTokenForManager, bus_types.updateBusType);

module.exports = router;
