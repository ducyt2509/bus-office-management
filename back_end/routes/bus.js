const buses = require('../controllers').bus;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post('/admin/add-bus', middleWare.verifyTokenForManager, buses.addNewBus);
router.delete('/admin/delete-bus', middleWare.verifyTokenForManager, buses.deleteBus);
router.get('/list-bus', middleWare.verifyTokenForStaff, buses.getListBus);
router.post('/bus-by-id', middleWare.verifyTokenForDriver, buses.getInformationBus);
router.post('/admin/update-bus', middleWare.verifyTokenForManager, buses.updateBusInformation);
module.exports = router;
