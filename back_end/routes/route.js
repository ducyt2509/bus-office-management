const routes = require('../controllers').route;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.delete('/route/delete-route', middleWare.verifyTokenForManager, routes.deleteRoute);
router.post('/route/add-route', middleWare.verifyTokenForManager, routes.addNewRoute);
router.put('/route/update-route', middleWare.verifyTokenForManager, routes.updateRoute);
router.post('/route/list-route', middleWare.verifyTokenForManager, routes.getListRoute);
router.post('/route/route-by-id', middleWare.verifyTokenForManager, routes.getRouteById);

// router.delete('/route/delete-route', routes.deleteRoute);
// router.post('/route/add-route', routes.addNewRoute);
// router.put('/route/update-route', routes.updateRoute);
// router.post('/route/list-route', routes.getListRoute);
// router.post('/route/route-by-id', routes.getRouteById);
module.exports = router;
