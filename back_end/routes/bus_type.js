const bus_types = require("../controllers").bus_type;
var router = require("express").Router();

router.get("/list-bus-type", bus_types.getListBusType);
router.get("/delete-bus-type", bus_types.deleteBusType);
router.post("/add-bus-type", bus_types.addNewBusType);

module.exports = router;
