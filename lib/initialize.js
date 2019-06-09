'use-strict';

var g = require('strong-globalize')();
var Web3 = require('web3');

// var debug = require('debug')('loopback:connector:web3');

/**
 * Initializes the connector
 * @param {} dataSource 
 * @param {Function} [callback] callback
 */
module.exports = exports = ContractConnector;

/**
 * @constructor
 * Creates the contract connector
 * @param {} settings 
 * The Datasource settings are the datasource.json object
 * 
 */
function ContractConnector(settings) {

	if (!settings.provider) {
		throw new Error(g.f('{{settings.provider}} must exist. Check {{datasource.json}}'));
	}

	if (typeof settings.provider !== 'string') {
		throw new Error(g.f('{{settings.provider}} must be type of {{string}}. Check {{datasource.json}}'));
	}


	// if (!settings.options) {
	// 	throw new Error(g.f('{{settings.options}} must exist. Check {{datasource.json}}'));
	// }

	// if (typeof settings.options !== 'object') {
	// 	throw new Error(g.f('{{settings.options}} must be type of {{object}}. Check {{datasource.json}}'));
	// }

	if (!settings.abi) {
		throw new Error(g.f('{{settings.abi}} must exist. Check {{datasource.json}}'));
	}

	if (settings.abi.constructor !== Array) {
		throw new Error(g.f('{{settings.abi}} must be type of {{array}}. Check {{datasource.json}}'));
	}

	if (!settings.address) {
		throw new Error(g.f('{{settings.address}} must exist. Check {{datasource.json}}'));
	}

	if (typeof settings.address !== 'string') {
		throw new Error(g.f('{{settings.address}} must be type of {{string}}. Check {{datasource.json}}'));
	}

	this.provider = settings.provider;
	this.abi = settings.abi;
	this.address = settings.address;
	this.options = settings.options;

};

ContractConnector.initialize = function initializeConnector(dataSource, callback) {

	if (typeof dataSource !== 'object') {
		throw new Error(g.f('{{dataSource}} must be type of {{object}}'));
	}

	var connector = dataSource.connector = new ContractConnector(dataSource.settings);

	connector.getDataAccessObject();

	dataSource.connector.dataSource = dataSource;

	if (callback) {
		process.nextTick(callback);
	}

}

/**
 * It's necessary the callback because loopback sends a callback in the
 * arguments and must be resolved to make the connector 'connected state'
 */
ContractConnector.prototype.connect = function (callback) {

	try {
	 	this.DataAccessObject.web3.eth.net.getId(callback);
	} catch (error) {
		console.error(g.f("{{web3}} can't connect to network"));
	}
}


/**
 * @returns {Object}
 */
ContractConnector.prototype.getDataAccessObject = function () {
	if (this.DataAccessObject) {
		return this.DataAccessObject;
	}
	var self = this;
	var DataAccessObject = function () { };

	var web3 = DataAccessObject.web3 = new Web3(this.provider);
	var contract = DataAccessObject.contract = new web3.eth.Contract(this.abi, this.address, this.options);

	self.DataAccessObject = DataAccessObject;

	return self.DataAccessObject;
}
