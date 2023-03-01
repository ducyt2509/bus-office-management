const bus_schedules = require('../controllers').bus_schedule;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post(
  '/admin/create-bus-schedule',
  middleWare.verifyTokenForManager,
  bus_schedules.createNewBusSchedule
);
router.put(
  '/admin/update-bus-schedule',
  middleWare.verifyTokenForManager,
  bus_schedules.updateBusSchedule
);
router.delete(
  '/admin/delete-bus-schedule',
  middleWare.verifyTokenForManager,
  bus_schedules.deleteBusSchedule
);
router.get(
  '/admin/list-bus-schedule',
  middleWare.verifyTokenForManager,
  bus_schedules.getListBusSchedule
);

module.exports = router;
