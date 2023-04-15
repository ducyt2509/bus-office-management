const tickets = require("../controllers").ticket;
var router = require("express").Router();

router.post("/revenue/list-revenue", tickets.getRevenueList);

module.exports = router;
