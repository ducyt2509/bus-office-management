const users = require('../controllers').user;
var router = require('express').Router();

router.post('/send-otp', users.sendCodeOTP);
router.post('/login', users.loginAccount);

module.exports = router;
