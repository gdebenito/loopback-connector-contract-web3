'use-strict';

// Strong Globalize is a library to make the application multilanguage
var g = require('strong-globalize')();

// Import Web3
var Web3 = require('web3');

// Import truffle hdwallet provider
var HDWalletProvider = require('truffle-hdwallet-provider');

// Import filesystem module for read mnemonic from file
var fs = require('fs');

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

	if (settings.mnemonic) {
		if (typeof settings.mnemonic !== 'object') {
			throw new Error(g.f('{{settings.mnemonic}} must be type of {{object}}. Check {{datasource.json}}'));
		}

		if (!settings.mnemonic.method) {
			throw new Error(g.f('{{settings.mnemonic.method}} must exist {{string}}. Can be "raw" or "file". Check {{datasource.json}}'));
		}

		if (typeof settings.mnemonic.method !== 'string') {
			throw new Error(g.f('{{settings.mnemonic.method}} must be type of {{string}}. Check {{datasource.json}}'));
		}

		if (settings.mnemonic.method !== 'raw' && settings.mnemonic.method !== 'file') {
			throw new Error(g.f('{{settings.mnemonic.method}} must be "raw" or "file". Check {{datasource.json}}'));
		}

		if (!settings.mnemonic.value) {
			throw new Error(g.f('{{settings.mnemonic.value}} must exist. Check {{datasource.json}}'));
		}

		if (typeof settings.mnemonic.value !== 'string') {
			throw new Error(g.f('{{settings.mnemonic.value}} must be type of {{string}}. Check {{datasource.json}}'));
		}

	}

	this.abi = settings.abi;
	this.address = settings.address;
	this.options = settings.options;

	// If mnemonic is set
	if (settings.mnemonic) {

		var mnemonic;

		if (settings.mnemonic.method === 'file') {

			if (fs.existsSync(settings.mnemonic.value)) {

				var stats = fs.statSync(settings.mnemonic.value);

				if (stats.isFile()) {

					// Read mnemonic from file
					console.log(__dirname)
					mnemonic = fs.readFileSync(settings.mnemonic.value, { encoding: 'utf8' });

				} else {

					throw new Error(g.f('{{settings.mnemonic.value}} is not a file. Check {{datasource.json}}'));
				}

			} else {

				throw new Error(g.f('{{settings.mnemonic.value}} path does not exist. Check {{datasource.json}}'));

			}

		} else if (settings.mnemonic.method === 'raw') {

			mnemonic = settings.mnemonic.value;

		}

		// Use truffle Hardware Wallet Provider
		this.provider = new HDWalletProvider(mnemonic, settings.provider)

	} else {

		this.provider = settings.provider;

	}

};

ContractConnector.initialize = function (dataSource, callback) {

	if (typeof dataSource !== 'object') {
		throw new Error(g.f('{{dataSource}} must be type of {{object}}'));
	}

	var connector = dataSource.connector =
		new ContractConnector(dataSource.settings);

	connector.getDataAccessObject();

	dataSource.connector.dataSource = dataSource;

	/**
	 * Is required because the loopback legacy
	 */
	if (callback) {
		process.nextTick(callback);
	}

}


ContractConnector.prototype.connect = async function (callback) {

	/**
	 * When the web socket is listening ( from CONNECTING --> OPEN ) 
	 * will execute the callback. More info at: 
	 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Constants
	 */
	await this.DataAccessObject.web3.eth.net.isListening();

	/**
	 * It's necessary to call the callback because loopback sends a callback and 
	 * must be resolved to change state of the connector to 'connected state'
	 */
	process.nextTick(callback);

}

ContractConnector.prototype.disconnect = ContractConnector.prototype.close =
	async function (callback) {
		// Websocket close connection
		await this.DataAccessObject.web3.currentProvider.connection.close();
		// When is closed
		process.nextTick(callback);
	}


/**
 * @returns {Object}
 */
ContractConnector.prototype.getDataAccessObject = function () {

	// If the instance already exists
	if (this.DataAccessObject) {
		return this.DataAccessObject;
	}

	var self = this;
	var DataAccessObject = function () { };

	var web3 = DataAccessObject.web3 = new Web3(this.provider);
	DataAccessObject.contract =
		new web3.eth.Contract(this.abi, this.address, this.options);

	self.DataAccessObject = DataAccessObject;

	return self.DataAccessObject;
}
