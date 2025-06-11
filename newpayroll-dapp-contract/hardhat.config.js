require("@nomicfoundation/hardhat-ethers"); // Correct way to import ethers for Hardhat
// require("@nomicfoundation/hardhat-toolbox"); // If you used the toolbox template

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // This is the default in-memory network
    },
    ganache: {
      url: "http://127.0.0.1:8545", // Default Ganache URL
      accounts: [ // Use a private key from Ganache for deployment
        "0x2d582c8da9311d6fabca76c41e72709db707e34c40e52d15d4dafd7cc60dd870" // **IMPORTANT: Replace with a key from Ganache**
      ],
    },
  },
};