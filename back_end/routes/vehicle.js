const vehicles = require('../controllers').vehicle;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/vehicle/list-vehicle', vehicles.getListVehicle);
// router.delete(
//   '/vehicle/delete-vehicle',
//   middleWare.verifyTokenForManager,
//   vehicles.deleteVehicle
// );
// router.post('/vehicle/add-vehicle', middleWare.verifyTokenForManager, vehicles.addNewVehicle);
// router.put('/vehicle/update-vehicle', middleWare.verifyTokenForManager, vehicles.updateVehicle);

router.delete(
  '/vehicle/delete-vehicle',

  vehicles.deleteVehicle
);
router.post('/vehicle/add-vehicle', vehicles.addNewVehicle);
router.put('/vehicle/update-vehicle', vehicles.updateVehicle);

module.exports = router;
