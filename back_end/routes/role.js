const roles = require('../controllers').role;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/role/list-role', middleWare.verifyTokenForManager, roles.getListRole);

module.exports = router;
