const { initialize } = require('..');
const Web3 = require('web3');

// console.log(initialize);

let datasource = {};
datasource.settings = require('./datasource.2.json')

initialize(datasource)

// console.log(datasource)
