const { web3, contract } = require('../config/web3');
const User = require('../models/userModel'); 

exports.prepareDeposit = (req, res) => {
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
    res.status(500).json({ message: 'Failed to prepare deposit transaction.' });
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
      value: '0', 
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
      value: '0', 
    });
  } catch (error) {
    console.error('Error preparing send money:', error);
    res.status(500).json({ message: 'Failed to prepare send money transaction.' });
  }
};


exports.getBalance = async (req, res) => {
  try {
    const { email } = req.query;

    // Lookup the user's Ethereum address based on their email
    const user = await User.findOne({ email });
    if (!user || !user.ethAddress) {
      return res.status(404).json({ message: 'User not found or no Ethereum address associated with this email.' });
    }

    const ethAddress = user.ethAddress;

    // Fetch the balance from the smart contract
    const balance = await contract.methods.getBalance(ethAddress).call();
    const balanceInEther = web3.utils.fromWei(balance, 'ether');

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error('Blockchain Error:', error);
    res.status(500).json({ message: 'Failed to retrieve the Ethereum balance.' });
  }
};



/*
const ethAddress = req.query.ethAddress; 
    if (!web3.utils.isAddress(ethAddress)) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }
*/