const express = require('express');
const {addHotel,
    deleteHotel} = require('../controllers/hotelController');

const router = express.Router();

router.post("/addHotel", addHotel)

router.delete("/deleteHotel", deleteHotel)

module.exports = router;