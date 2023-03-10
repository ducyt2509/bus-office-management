const buses = require('../controllers').bus;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

// router.post('/bus/add-bus', middleWare.verifyTokenForManager, buses.addNewBus);
// router.delete('/bus/delete-bus', middleWare.verifyTokenForManager, buses.deleteBus);
// router.post('/bus/list-bus', middleWare.verifyTokenForStaff, buses.getListBus);
// router.post('/bus/bus-by-id', middleWare.verifyTokenForDriver, buses.getInformationBus);
// router.put('/bus/update-bus', middleWare.verifyTokenForManager, buses.updateBusInformation);

router.post('/bus/add-bus', buses.addNewBus);
router.delete('/bus/delete-bus', buses.deleteBus);
router.post('/bus/list-bus', buses.getListBus);
router.post('/bus/bus-by-id', buses.getInformationBus);
router.put('/bus/update-bus', buses.updateBusInformation);
module.exports = router;
