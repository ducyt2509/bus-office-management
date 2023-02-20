const roles = require('../controllers').role;
var router = require('express').Router();

router.get('/list-role', roles.getListRole);

module.exports = router;
