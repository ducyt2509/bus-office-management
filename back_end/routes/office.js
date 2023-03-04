const offices = require('../controllers').office;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post('/office/add-office', middleWare.verifyTokenForManager, offices.createNewOffice);
router.put(
  '/office/update-office',
  middleWare.verifyTokenForManager,
  offices.updateOfficeInformation
);
router.delete(
  '/office/delete-office',
  middleWare.verifyTokenForManager,
  offices.deleteOfficeInformation
);
router.get('/office/list-office', middleWare.verifyTokenForManager, offices.getListOffice);
router.post('/office/office-by-id', middleWare.verifyTokenForManager, offices.getOfficeInformation);
module.exports = router;
