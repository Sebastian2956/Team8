const express = require('express');
const {updateBudget} = require('../controllers/budgetController');
const router = express.Router();

router.post("/updateBudget", updateBudget)

module.exports = router;