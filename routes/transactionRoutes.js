const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/prepare-deposit', transactionController.prepareDeposit);
router.post('/prepare-withdraw', transactionController.prepareWithdraw);
router.post('/prepare-send', transactionController.prepareSendMoney);
router.get('/balance', transactionController.getBalance);

module.exports = router;
