Datasource example

```jsonc
{
	"name": "datasource",
	"connector": "@gdbc/loopback-connector-contract-web3",
	"provider": "ws://localhost:8545",
	"abi":[],
	"address": "0x1234567890987654321234567890987654321234",
	"options": {
		"defaultAccount": "0x1234567890987654321234567890987654321234"
	},
	"mnemonic" : {
		"method" : "raw",
		"value": "spike member shift round van idea despair have provide tunnel silent rug"
	},
}
```