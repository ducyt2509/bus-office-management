const bus_schedules = require('../controllers').bus_schedule;
var router = require('express').Router();

router.post('/admin/create-bus-schedule', bus_schedules.createNewBusSchedule);

module.exports = router;
