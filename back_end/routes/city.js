const cities = require('../controllers').city;
var router = require('express').Router();

router.get('/list-city', cities.getListCity);

module.exports = router;
