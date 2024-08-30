const { web3, contract } = require('../config/web3');
const User = require('../models/userModel'); // Assuming you have a User model

// Deposit Ether to Contract
exports.deposit = async (req, res) => {
  const { amount } = req.body; // Amount should be in Ether
  const user = await User.findById(req.user.id);

  try {
    const receipt = await web3.eth.sendTransaction({
      from: user.ethAddress,
      to: contract.options.address,
      value: web3.utils.toWei(amount, 'ether')
    });
    res.json({ message: "Deposit successful", transaction: receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Withdraw Ether from Contract
exports.withdraw = async (req, res) => {
  // Implementation depends on contract methods available
};

// Send Ether to another user
exports.send = async (req, res) => {
  const { recipientEmail, amount } = req.body;
  const sender = await User.findById(req.user.id);
  const recipient = await User.findOne({ email: recipientEmail });

  if (!recipient) {
    return res.status(404).json({ error: "Recipient not found" });
  }

  try {
    const receipt = await contract.methods.transfer(recipient.ethAddress, web3.utils.toWei(amount, 'ether')).send({
      from: sender.ethAddress
    });
    res.json({ message: "Funds sent successfully", transaction: receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBalance = async (req, res) => {
    const userEthAddress = req.user.ethAddress;  // Make sure this is set correctly in your user's session or however you manage user state
    try {
        const balance = await contract.methods.getBalance(userEthAddress).call();
        res.json({ balance: web3.utils.fromWei(balance, 'ether') });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance: ' + error.message });
    }
};