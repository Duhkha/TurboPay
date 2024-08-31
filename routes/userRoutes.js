const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);
//router.get('/balance', transactionController.getBalanceXX); //????

module.exports = router;
