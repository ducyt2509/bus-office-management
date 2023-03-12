const roles = require("../controllers").role;
var router = require("express").Router();
const middleWare = require("../middleware/permission.middleware");

// router.get('/role/list-role', middleWare.verifyTokenForManager, roles.getListRole);

router.get("/role/list-role", roles.getListRole);

module.exports = router;
