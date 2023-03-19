const bus_schedules = require('../controllers').bus_schedule;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post(
  '/bus-schedule/create-bus-schedule',
  // middleWare.verifyTokenForManager,
  bus_schedules.createNewBusSchedule
);
router.put(
  '/bus-schedule/update-bus-schedule',
  // middleWare.verifyTokenForManager,
  bus_schedules.updateBusSchedule
);
router.delete(
  '/bus-schedule/delete-bus-schedule',
  // middleWare.verifyTokenForManager,
  bus_schedules.deleteBusSchedule
);
router.post(
  '/bus-schedule/list-bus-schedule',
  // middleWare.verifyTokenForManager,
  bus_schedules.getListBusSchedule
);
router.post(
  '/bus-schedule/bus-schedule-by-id',
  // middleWare.verifyTokenForManager,
  bus_schedules.getBusScheduleById
);

module.exports = router;
