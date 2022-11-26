require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  /**
  * -----------------------------------------------------------------------------------
  * @dev networks configuration.
  * -----------------------------------------------------------------------------------
  */
  networks: {
    /**
    * @dev deploy in local witch Ganache
    * @command compile   : truffle compile
    * @command migration : truffle migrate
    */
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    /**
    * ---------------------------------------------------------------------------------
    * @dev Useful for deploying to a public network.
    * @instrucs for deploy on testnet create .env in truffle folder and create MNEMONIC=<your mnemonic>
    * ---------------------------------------------------------------------------------
    */

    /**
    * @dev Avalanche fuji testnet
    * @command migration : truffle migrate --network fuji
    * @faucet https://faucet.avax.network/  
    * @explorer https://testnet.snowtrace.io/
    */
    fuji: {
      provider: function() {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://api.avax-test.network/ext/bc/C/rpc`)
      },
      network_id: 43113,
      timeoutBlocks: 200,
      confirmations: 5,
    },
  },

  /**
  * -----------------------------------------------------------------------------------
  * @dev Set default mocha options here, use special reporters, etc.
  * -----------------------------------------------------------------------------------
  */
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : { 
      gasPrice:1,
      token:'ETH',
      showTimeSpent: true,
    }
  },

  /**
  * -----------------------------------------------------------------------------------
  * @dev Configure your compilers.
  * -----------------------------------------------------------------------------------
  */
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       }
      }
    }
  },
  
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "sqlite",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
