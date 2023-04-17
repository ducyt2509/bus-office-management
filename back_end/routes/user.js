const users = require('../controllers').user;
const middleWare = require('../middleware/permission.middleware');
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/verify-otp', users.verifyCodeOTP);
router.put('/change-password', users.changePassword);
router.post('/login', users.loginAccount);
// router.post('/user/user-by-id', middleWare.verifyTokenForDriver, users.getUserInformation);
// router.put('/user/update-user', middleWare.verifyTokenForDriver, users.updateInformationUser);
// router.get('/user/list-user', middleWare.verifyTokenForManager, users.getListUser);
// router.post('/user/add-user', middleWare.verifyTokenForManager, users.createNewUser);
// router.delete('/user/delete-user', middleWare.verifyTokenForManager, users.deleteUser);

router.post('/user/user-by-id', users.getUserInformation);
router.put('/user/update-user', users.updateInformationUser);
router.post('/user/list-user', users.getListUser);
router.post('/user/add-user', users.createNewUser);
router.delete('/user/delete-user', users.deleteUser);
router.post('/refresh-token', users.requestRefreshToken);

module.exports = router;
