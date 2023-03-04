const locations = require('../controllers').location;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/location/list-location', middleWare.verifyTokenForManager, locations.getListLocation);
router.delete('/location/delete-location', middleWare.verifyTokenForManager, locations.deleteLocation);
router.post('/location/add-location', middleWare.verifyTokenForManager, locations.addNewLocation);
router.put('/location/update-location', middleWare.verifyTokenForManager, locations.updateLocation);

module.exports = router;
