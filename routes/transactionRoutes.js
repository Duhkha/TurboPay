const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/prepare-deposit', transactionController.prepareDeposit);
router.post('/prepare-withdraw', transactionController.prepareWithdraw);
router.post('/prepare-send', transactionController.prepareSendMoney);
router.get('/balance', transactionController.getBalance);

//should seperate log from transactions
router.post('/log', transactionController.logTransaction);
router.get('/log-email', transactionController.getLogsByEmail); //should be private but on blockchain we can see all transaction

module.exports = router;
