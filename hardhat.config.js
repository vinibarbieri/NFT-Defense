require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    polygonAmoy: {
      url: process.env.QUICKNODE_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Coloque sua chave privada no .env
    },
  },
};
