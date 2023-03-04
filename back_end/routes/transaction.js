const transactions = require('../controllers').transaction;
const middleWare = require('../middleware/permission.middleware');
var router = require('express').Router();

router.post('/transaction/create-payment', transactions.createPayment);
router.get('/transaction/result_payment', transactions.returnPaymentResult);
router.post('/transaction/refund-transaction', transactions.refundPayment);
router.get(
  '/transaction/list-transaction',
  middleWare.verifyTokenForStaff,
  transactions.getListPayment
);
module.exports = router;
