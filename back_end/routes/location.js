const locations = require('../controllers').location;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/admin/list-location', middleWare.verifyTokenForManager, locations.getListLocation);
router.delete('/admin/delete-location', middleWare.verifyTokenForManager, locations.deleteLocation);
router.post('/admin/add-location', middleWare.verifyTokenForManager, locations.addNewLocation);
router.put('/admin/update-location', middleWare.verifyTokenForManager, locations.updateLocation);

module.exports = router;
