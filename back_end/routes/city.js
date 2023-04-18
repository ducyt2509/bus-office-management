const cities = require('../controllers').city;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post('/city/list-city', cities.getListCity);
router.post('/city/add-city', middleWare.verifyTokenForManager, cities.addNewCity);
router.put('/city/update-city', middleWare.verifyTokenForManager, cities.updateCity);
router.delete('/city/delete-city', middleWare.verifyTokenForManager, cities.deleteCity);


// router.post('/city/list-city', cities.getListCity);
// router.post('/city/add-city', cities.addNewCity);
// router.put('/city/update-city', cities.updateCity);
// router.delete('/city/delete-city', cities.deleteCity);
module.exports = router;
