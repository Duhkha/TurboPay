const { Web3 } = require('web3');
require('dotenv').config();
const path = require('path');

// Create a Web3 instance directly with the HttpProvider
const web3 = new Web3(process.env.INFURA_URL);

// Import the contract ABI
const contractABI = require(path.resolve(__dirname, '../abi.json'));

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);

module.exports = { web3, contract };