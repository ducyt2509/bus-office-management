const vehicle_types = require('../controllers').vehicle_type;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/vehicle-type/list-vehicle-type', vehicle_types.getListVehicleType);
// router.delete(
//   '/vehicle-type/delete-vehicle-type',
//   middleWare.verifyTokenForManager,
//   vehicle_types.deleteVehicle
// );
// router.post('/vehicle-type/add-vehicle-type', middleWare.verifyTokenForManager, vehicle_types.addNewVehicle);
// router.put('/vehicle-type/update-vehicle-type', middleWare.verifyTokenForManager, vehicle_types.updateVehicle);

router.delete(
  '/vehicle-type/delete-vehicle-type',

  vehicle_types.deleteVehicleType
);
router.post('/vehicle-type/add-vehicle-type', vehicle_types.addNewVehicleType);
router.put('/vehicle-type/update-vehicle-type', vehicle_types.updateVehicleType);

module.exports = router;
