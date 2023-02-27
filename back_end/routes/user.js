const users = require('../controllers').user;
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/login', users.verifyCodeOTP);
router.put('/change-password', users.changePassword);
router.post('/login', users.loginAccount);
router.post('/user-by-id', users.getUserInformation);
router.put('/update-user', users.updateInformationUser);
router.post('/admin/list-user', users.getListUser);
router.post('/admin/add-user', users.createNewUser);
router.delete('/admin/delete-user', users.deleteUser);

module.exports = router;
