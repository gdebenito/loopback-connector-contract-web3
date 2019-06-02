Datasource example

```jsonc
{
	"name": "datasource",
	"connector": "@gdbc/loopback-connector-contract-web3",
	// Web3 provider (optional if web3 intance is injected through the datasource creation)
	"provider": "ws//localhost:8545",
	"options": {
		// ByteCode (optional)
		"data": "",
		// Address (required)
		"address": "0x1234567890987654321234567890987654321234",
		"defaultAccount": "",
		"defaultBlock": "",
		"defaultGas": "",
		"defaultGasPrice": "",
		"transactionBlockTimeout": "",
		"transactionConfirmationBlocks": "",
		"transactionPollingTimeout": "",
		"transactionSigner": ""
	},
	// If deploy options are defined, the contract can be deployed (optional)
	"deploy": {
		// bytecode (required)
		"data": "",
		// Contract arguments for deploy
		"args": [
			"123",
			123
		]
	}
}
```