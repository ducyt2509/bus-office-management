const buses = require('../controllers').bus;
var router = require('express').Router();

router.post('/admin/add-bus', buses.createNewBus);
router.delete('/admin/delete-bus', buses.deleteBus);
router.post('/admin/list-bus', buses.getListBus);
router.post('/admin/bus-by-id', buses.getInformationBus);
router.post('/admin/update-bus', buses.updateBusInformation);
module.exports = router;
