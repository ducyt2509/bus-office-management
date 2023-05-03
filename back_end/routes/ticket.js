const middleWare = require("../middleware/permission.middleware");

const tickets = require("../controllers").ticket;
var router = require("express").Router();

router.post("/revenue/list-revenue", middleWare.verifyTokenForManager, tickets.getRevenueList);
router.post("/ticket/create-ticket", middleWare.verifyTokenForDriver, tickets.createNewTicket);

module.exports = router;
