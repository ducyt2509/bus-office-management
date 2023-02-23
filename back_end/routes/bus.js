const buses = require('../controllers').bus;
var router = require('express').Router();

router.post('/admin/create-bus', buses.createNewBus);
module.exports = router;
