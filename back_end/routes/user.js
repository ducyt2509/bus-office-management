const users = require('../controllers').user;
var router = require('express').Router();

router.post('/register', users.registerUser);
router.get('/list-user', users.getListUser);

module.exports = router;
