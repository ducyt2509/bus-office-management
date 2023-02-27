const offices = require('../controllers').office;
var router = require('express').Router();

router.post('/admin/add-office', offices.createNewOffice);
router.post('/admin/update-office', offices.updateOfficeInformation);
router.post('/admin/delete-office', offices.deleteOfficeInformation);
router.post('/admin/list-office', offices.getListOffice);
router.post('/admin/office-by-id', offices.getOfficeInformation);
module.exports = router;
