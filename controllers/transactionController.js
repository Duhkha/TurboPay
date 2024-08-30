const Web3 = require('web3');
const web3 = new Web3(process.env.INFURA_URL);

exports.deposit = async (req, res) => {
    // Interaction with the smart contract to deposit funds
    res.send('Deposit successful');
};

exports.withdraw = async (req, res) => {
    // Interaction with the smart contract to withdraw funds
    res.send('Withdrawal successful');
};

exports.send = async (req, res) => {
    // Interaction with the smart contract to send funds
    res.send('Funds sent');
};
