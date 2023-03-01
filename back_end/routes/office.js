const offices = require('../controllers').office;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

router.post('/admin/add-office', middleWare.verifyTokenForManager, offices.createNewOffice);
router.put(
  '/admin/update-office',
  middleWare.verifyTokenForManager,
  offices.updateOfficeInformation
);
router.delete(
  '/admin/delete-office',
  middleWare.verifyTokenForManager,
  offices.deleteOfficeInformation
);
router.get('/admin/list-office', middleWare.verifyTokenForManager, offices.getListOffice);
router.post('/admin/office-by-id', middleWare.verifyTokenForManager, offices.getOfficeInformation);
module.exports = router;
