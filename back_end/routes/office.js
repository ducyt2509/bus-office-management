const offices = require('../controllers').office;
var router = require('express').Router();
const middleWare = require('../middleware/permission.middleware');

// router.post('/office/add-office', middleWare.verifyTokenForManager, offices.createNewOffice);
// router.put(
//   '/office/update-office',
//   middleWare.verifyTokenForManager,
//   offices.updateOfficeInformation
// );
// router.delete(
//   '/office/delete-office',
//   middleWare.verifyTokenForManager,
//   offices.deleteOfficeInformation
// );
// router.get('/office/list-office', middleWare.verifyTokenForManager, offices.getListOffice);
// router.post('/office/office-by-id', middleWare.verifyTokenForManager, offices.getOfficeInformation);

router.post('/office/add-office', offices.createNewOffice);
router.put(
  '/office/update-office',

  offices.updateOfficeInformation
);
router.delete(
  '/office/delete-office',

  offices.deleteOfficeInformation
);
router.post('/office/list-office', offices.getListOffice);
router.post('/office/office-by-id', offices.getOfficeInformation);
module.exports = router;
