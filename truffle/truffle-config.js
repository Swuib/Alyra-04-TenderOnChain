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
      gas: 3000000,
      gasPrice: 50,
      skipDryRun: true
    },


    goerli: {
      provider: () => {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://goerli.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id: 5,       // Goerli's network id
      // chain_id: 5,         // Goerli's chain id
      // gas: 5500000,        // Gas limit used for deploys.
      // confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets)
    }




    
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
         enabled: true,
         runs: 200
       },
       viaIR : true,
      }
    }
  },
};
