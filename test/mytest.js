const { initialize } = require('../');
const settings = require('./datasource.json');

// console.log(initialize);

(async function test() {
	let datasource = {};
	datasource.settings = settings;

	try {
		initialize(datasource);
		// console.log(datasource.connector.DataAccessObject);

		// console.log(
		// 	// datasource.connector.DataAccessObject.web3.currentProvider.connection, // web socket
		// 	datasource.connector.DataAccessObject.web3.currentProvider.connection.readyState,  // 0 means connecting
		// 	await datasource.connector.DataAccessObject.web3.eth.net.getId(),
		// 	datasource.connector.DataAccessObject.web3.currentProvider.connection.readyState  // 1 means open connection
		// )

		// until the web socket is listening
		await datasource.connector.DataAccessObject.web3.eth.net.isListening();
		// will execute the getId from the network
		const id = await datasource.connector.DataAccessObject.web3.eth.net.getId();

		console.log(id);

	} catch (err) {

		throw err;

	} finally {
		// datasource.connector.disconnect();
		datasource.connector.close(() => {
			console.log('good bye')
		});
	}

})()
