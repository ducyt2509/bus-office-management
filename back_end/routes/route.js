const routes = require('../controllers').route;
var router = require('express').Router();

router.post('/admin/create-route', routes.createNewRoute);
module.exports = router;
