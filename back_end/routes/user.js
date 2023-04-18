const users = require('../controllers').user;
const middleWare = require('../middleware/permission.middleware');
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/verify-otp', users.verifyCodeOTP);
router.put('/change-password', users.changePassword);
router.post('/login', users.loginAccount);
router.post('/refresh-token', users.requestRefreshToken);
router.post('/logout', middleWare.verifyTokenForCustomer, users.logoutAccount);
// router.post('/user/user-by-id', middleWare.verifyTokenForDriver, users.getUserInformation);
// router.put('/user/update-user', middleWare.verifyTokenForDriver, users.updateInformationUser);
// router.get('/user/list-user', middleWare.verifyTokenForManager, users.getListUser);
// router.post('/user/add-user', middleWare.verifyTokenForManager, users.createNewUser);
// router.delete('/user/delete-user', middleWare.verifyTokenForManager, users.deleteUser);

router.post('/user/user-by-id', middleWare.verifyTokenForCustomer, users.getUserInformation);
router.put('/user/update-user', middleWare.verifyTokenForCustomer, users.updateInformationUser);
router.post('/user/list-user', middleWare.verifyTokenForCustomer, users.getListUser);
router.post('/user/add-user', middleWare.verifyTokenForDriver, users.createNewUser);
router.delete('/user/delete-user', middleWare.verifyTokenForDriver, users.deleteUser);

module.exports = router;
