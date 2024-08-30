const express = require('express');
const { deposit, withdraw, send } = require('../controllers/transactionController');
const router = express.Router();

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/send', send);

module.exports = router;
