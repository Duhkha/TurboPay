const { web3, contract } = require('../config/web3');
const User = require('../models/userModel'); 
const TransactionLog = require('../models/transactionModel');

exports.prepareDeposit = async (req, res) => {
  try {
      const { amountInWei } = req.body;

      if (!amountInWei || isNaN(amountInWei)) {
          return res.status(400).json({ message: 'Invalid amount specified.' });
      }

      const txData = contract.methods.deposit().encodeABI();

    

      res.json({
          to: process.env.CONTRACT_ADDRESS,
          data: txData,
          value: amountInWei,
      });
  } catch (error) {
      console.error('Error preparing deposit:', error);
      res.status(500).json({ message: 'Failed to prepare deposit transaction.', error: error.message });
  }
};


exports.prepareWithdraw = (req, res) => {
  try {
    const { amountInWei } = req.body;
    if (!amountInWei || isNaN(amountInWei)) {
      return res.status(400).json({ message: 'Invalid amount specified.' });
    }
    const txData = contract.methods.withdraw(amountInWei).encodeABI();
    res.json({
      to: process.env.CONTRACT_ADDRESS,
      data: txData,
      value: '0'
      // No need to specify gas, as MetaMask will handle this
    });
  } catch (error) {
    console.error('Error preparing withdraw:', error);
    res.status(500).json({ message: 'Failed to prepare withdraw transaction.' });
  }
};


exports.prepareSendMoney = async (req, res) => {
  try {
    const { recipientEmail, amountInWei } = req.body;
    const recipientUser = await User.findOne({ email: recipientEmail });
    if (!recipientUser || !recipientUser.ethAddress) {
      return res.status(404).json({ message: 'Recipient not found or no Ethereum address associated with this email.' });
    }
    const recipient = recipientUser.ethAddress;
    if (!amountInWei || isNaN(amountInWei)) {
      return res.status(400).json({ message: 'Invalid amount specified.' });
    }
    const txData = contract.methods.sendMoney(recipient, amountInWei).encodeABI();
    res.json({
      to: process.env.CONTRACT_ADDRESS,
      data: txData,
      value: '0'
      // No need to specify gas, as MetaMask will handle this
    });
  } catch (error) {
    console.error('Error preparing send money:', error);
    res.status(500).json({ message: 'Failed to prepare send money transaction.' });
  }
};


exports.getBalance = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user || !user.ethAddress) {
      return res.status(404).json({ message: 'User not found or no Ethereum address associated with this email.' });
    }

    const ethAddress = user.ethAddress;

    const balance = await contract.methods.getBalance(ethAddress).call();
    const balanceInEther = web3.utils.fromWei(balance, 'ether');

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error('Blockchain Error:', error);
    res.status(500).json({ message: 'Failed to retrieve the Ethereum balance.' });
  }
};

exports.logTransaction = async (req, res) => {
  try {
    const { type, from, to, amount } = req.body;

    if (!type || !from || !to || !amount ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const validTypes = ['deposit', 'withdraw', 'send'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type.' });
    }

    const log = new TransactionLog({
      type,
      from,
      to,
      amount
    });

    await log.save();

    res.status(201).json({ message: 'Transaction logged successfully' });
  } catch (error) {
    console.error('Error logging transaction:', error);
    res.status(500).json({ message: 'Failed to log transaction.' });
  }
};

exports.getLogsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.ethAddress) {
      return res.status(404).json({ message: 'User not found or Ethereum address not associated with this email.' });
    }

    const ethAddress = user.ethAddress;
    
    const logs = await TransactionLog.find({
      $or: [{ from: ethAddress }, { to: ethAddress }]
    }).sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs by email:', error);
    res.status(500).json({ message: 'Failed to fetch transaction logs.' });
  }
};



/*
const ethAddress = req.query.ethAddress; 
    if (!web3.utils.isAddress(ethAddress)) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
*/