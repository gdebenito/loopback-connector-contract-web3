const { initialize } = require('../');
const settings = require('./datasource.json');

// console.log(initialize);

(async function test() {
	let datasource = {};
	datasource.settings = settings;

	try {
		initialize(datasource);
		// console.log(datasource.connector.DataAccessObject);

		await datasource.connector.connect();

	} catch (err) {
		throw err;

	} finally {
		datasource.connector.DataAccessObject.web3.currentProvider.connection.close()
	}

})()
