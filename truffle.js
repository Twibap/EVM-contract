const HDWalletProvider = require("truffle-hdwallet-provider");
const Confidential = require("./confidential.js");

/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

	networks:{
		// ganachi-cli 사용할 때
		// ganachi-cli -p 9545
		development: {
			host: "localhost",
			port: 9545,
			network_id: "*"
		},
		// ropsten testnet에 배포할 때
		// truffle migrate --network ropsten
		ropsten:{ 
			provider: ()=> new HDWalletProvider(
				Confidential.MNEMONIC,
				"https://ropsten.infura.io/v3/" + Confidential.INFURA_PROJECT_ID
			),
			network_id: "3",
		}
	}

};
