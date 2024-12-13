const express = require('express');
const {findFlightsFromToWhere,
    getAirport,
    searchFlights,
    addFlight,
    deleteFlight} = require('../controllers/flightControllers');

const router = express.Router();

router.get("/findFlightsFromToWhereOnDate", findFlightsFromToWhere)

router.get("/getNearestAirport", getAirport)

router.post("/addFlight", addFlight)

router.post("/searchFlights", searchFlights)

router.delete("/deleteFlight", deleteFlight)

module.exports = router;
