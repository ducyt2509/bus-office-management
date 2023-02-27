const users = require('../controllers').user;
const middleWare = require('../middleware/permission.middleware');
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/verify-otp', users.verifyCodeOTP);
router.put('/change-password', users.changePassword);
router.post('/login', users.loginAccount);
router.post('/user-by-id', users.getUserInformation);
router.put('/update-user', users.updateInformationUser);
router.get('/admin/list-user', middleWare.verifyTokenForManager, users.getListUser);
router.post('/admin/add-user', users.createNewUser);
router.delete('/admin/delete-user', users.deleteUser);

module.exports = router;
