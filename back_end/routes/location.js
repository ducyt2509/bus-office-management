const locations = require("../controllers").location;
var router = require("express").Router();

router.get("/list-location", locations.getAll);
router.get("/delete-location", locations.deleteLocation);
router.post("/add-location", locations.addNewLocation);

module.exports = router;
