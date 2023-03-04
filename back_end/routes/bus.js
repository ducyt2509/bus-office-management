const buses = require('../controllers').bus;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post('/bus/add-bus', middleWare.verifyTokenForManager, buses.addNewBus);
router.delete('/bus/delete-bus', middleWare.verifyTokenForManager, buses.deleteBus);
router.get('/bus/list-bus', middleWare.verifyTokenForStaff, buses.getListBus);
router.post('/bus/bus-by-id', middleWare.verifyTokenForDriver, buses.getInformationBus);
router.post('/bus/update-bus', middleWare.verifyTokenForManager, buses.updateBusInformation);
module.exports = router;
