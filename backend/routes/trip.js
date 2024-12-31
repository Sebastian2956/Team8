const express = require('express');
const {addTrip,
    updateTrip,
    deleteTrip,
    searchTrips} = require('../controllers/tripController');

const router = express.Router();

router.post("/addTrip", addTrip)

router.put("/updateTrip", updateTrip)

router.delete("/deleteTrip", deleteTrip)

router.post("/searchTrips", searchTrips)

module.exports = router;