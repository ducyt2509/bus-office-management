const users = require('../controllers').user;
const middleWare = require('../middleware/permission.middleware');
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/verify-otp', users.verifyCodeOTP);
router.put('/change-password', users.changePassword);
router.post('/login', users.loginAccount);
router.post('/user-by-id', middleWare.verifyTokenForDriver, users.getUserInformation);
router.put('/update-user', middleWare.verifyTokenForDriver, users.updateInformationUser);
router.get('/admin/list-user', middleWare.verifyTokenForManager, users.getListUser);
router.post('/admin/add-user', middleWare.verifyTokenForManager, users.createNewUser);
router.delete('/admin/delete-user', middleWare.verifyTokenForManager, users.deleteUser);

module.exports = router;
