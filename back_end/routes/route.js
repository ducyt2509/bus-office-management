const routes = require('../controllers').route;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.delete('/admin/delete-route', middleWare.verifyTokenForManager, routes.deleteRoute);
router.post('/admin/add-route', middleWare.verifyTokenForManager, routes.addNewRoute);
router.put('/admin/update-route', middleWare.verifyTokenForManager, routes.updateRoute);
router.get('/admin/get-list-route', middleWare.verifyTokenForManager, routes.getListRoute);
module.exports = router;
