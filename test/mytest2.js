const { initialize } = require('../');
const Web3 = require('web3');

// console.log(initialize);

let datasource = {};
datasource.settings = require('./datasource.json')

const web3 = new Web3(datasource.settings.provider);
