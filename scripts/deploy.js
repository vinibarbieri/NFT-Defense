async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy the ERC20 Token
    const Token = await ethers.getContractFactory("Token");
    const initialSupply = ethers.utils.parseUnits('1000000', 18); // 1,000,000 tokens
    const token = await Token.deploy(initialSupply);
    await token.deployed();
    console.log("Token deployed to:", token.address);
  
    // Deploy the Insurance Contract
    const Insurance = await ethers.getContractFactory("Insurance");
    const insurance = await Insurance.deploy();
    await insurance.deployed();
    console.log("Insurance contract deployed to:", insurance.address);
  
    // Deploy the Liquidity Pool Insurance
    const LiquidityPoolInsurance = await ethers.getContractFactory("LiquidityPoolInsurance");
    const liquidityPool = await LiquidityPoolInsurance.deploy(token.address, insurance.address);
    await liquidityPool.deployed();
    console.log("LiquidityPoolInsurance deployed to:", liquidityPool.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  