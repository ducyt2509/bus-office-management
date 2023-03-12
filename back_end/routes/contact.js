const contacts = require('../controllers').contact;

var router = require('express').Router();
router.post('/contact-us/send', contacts.send);

module.exports = router;
