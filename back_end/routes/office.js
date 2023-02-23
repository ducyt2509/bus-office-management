const offices = require('../controllers').office;
var router = require('express').Router();

router.post('/admin/create-office', offices.createNewOffice);
module.exports = router;
