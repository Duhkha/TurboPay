const { Web3 } = require('web3');
require('dotenv').config();
const path = require('path');

const web3 = new Web3(process.env.INFURA_URL);

const contractABI = require(path.resolve(__dirname, '../abi.json'));

const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);

module.exports = { web3, contract };