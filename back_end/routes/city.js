const cities = require('../controllers').city;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/list-city', cities.getListCity);
router.post('/admin/add-new-city', middleWare.verifyTokenForManager, cities.addNewCity);
router.put('/admin/update-city', middleWare.verifyTokenForManager, cities.updateCity);
router.delete('/admin/delete-city', middleWare.verifyTokenForManager, cities.deleteCity);

module.exports = router;
