const express = require('express');
const {queryAI} = require('../controllers/travelAIController');
const router = express.Router();

router.post("/queryAI", queryAI);

module.exports = router;

