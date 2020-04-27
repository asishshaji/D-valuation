const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "c78e528bb9d449de971906005c3fb9cc";

const mnemonic = "virus typical deny motion ceiling core genre fossil meadow guilt floor way"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
    }

  },
  compilers: {
    solc: {
      version: "^0.6.0"
    }
  }
};
