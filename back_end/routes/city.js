const cities = require('../controllers').city;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.get('/city/list-city', cities.getListCity);
router.post('/city/add-new-city', middleWare.verifyTokenForManager, cities.addNewCity);
router.put('/city/update-city', middleWare.verifyTokenForManager, cities.updateCity);
router.delete('/city/delete-city', middleWare.verifyTokenForManager, cities.deleteCity);

module.exports = router;
