# 🛡️ NFT Insurance System via Liquidity Pool

## Overview

This project implements a decentralized **insurance system for NFTs** that operates through a **liquidity pool**. The insurance contract allows users to insure their NFTs, paying monthly premiums that are managed via the liquidity pool. In the event of a claim, the insured can receive compensation from the pool, depending on the NFT's insured value.

The **liquidity pool** is powered by the **PYUSD** token, which serves as the primary asset for both insurance premium payments and liquidity provider rewards. This project is designed to run on the **Ethereum mainnet**, ensuring full decentralization and security.

## Key Features

1. **Liquidity Pool for Insurance Premiums**:
   - Users deposit **PYUSD tokens** into a shared liquidity pool.
   - Liquidity providers earn rewards based on their proportional contribution to the pool.
   - The pool is used to pay out claims in case of insured NFT losses.

2. **NFT Insurance**:
   - Users can insure NFTs by determining the insured value and paying monthly premiums.
   - The system incorporates oracles to check historical data for thefts or issues related to the insured NFT.
   - The monthly premium is calculated based on the insured value and associated risk factors.

3. **Claims Handling**:
   - Insured users can trigger a claim to receive compensation in case of a valid incident affecting their NFT.
   - Claims are processed via the liquidity pool, with payouts made in **PYUSD**.

4. **Ethereum Mainnet Deployment**:
   - The project is designed for deployment on the **Ethereum mainnet**, leveraging the decentralized nature and security of the Ethereum network.
   - **PYUSD** is an ERC-20 token utilized within the Ethereum ecosystem.

---

## Contracts Overview

### 1. **LiquidityPoolInsurance.sol**
This contract manages the **liquidity pool** where users deposit **PYUSD** and liquidity providers earn rewards based on their share in the pool. It also tracks insurance policies, ensuring that premiums are collected and claims are paid when necessary.

#### Key Functions:
- `deposit(uint256 _amount)`: Allows users to deposit **PYUSD** tokens into the liquidity pool.
- `withdraw(uint256 _amount)`: Enables users to withdraw their **PYUSD** tokens from the pool.
- `claimRewards()`: Allows liquidity providers to claim their accumulated rewards.
- `payPremiumToPool(uint256 _policyId)`: Pays the monthly premium for a specific NFT insurance policy.
- `processClaim(uint256 _policyId)`: Processes an insurance claim, transferring the insured value from the pool to the insured.

### 2. **Insurance.sol**
This contract handles the **creation and management of NFT insurance policies**. Users can create policies by insuring their NFTs for a specific value, paying monthly premiums based on the risk associated with the NFT.

#### Key Functions:
- `createPolicy(address _nftAddress, uint256 _insuredAmount, uint256 _riskFactor)`: Allows users to create a new NFT insurance policy.
- `payMonthlyPremium(uint256 _policyId)`: Pays the monthly premium for an active insurance policy.
- `claimInsurance(uint256 _policyId)`: Allows insured users to claim the insured amount in case of an incident.

### 3. **Oracle Integration**
- The system integrates with oracles (e.g., Chainlink) to fetch external data about the insured NFT, such as historical records of theft or incidents. This data is used to calculate the premium based on risk factors.

---

## Deployment

The contracts will be deployed on the **Ethereum mainnet**. The deployment process involves the following steps:

1. **Compile Contracts**:
   Compile the Solidity contracts using **Hardhat** or **Truffle**.

   ```bash
   npx hardhat compile
   ```

2. **Deploy on Ethereum Mainnet**:
   Deploy the compiled contracts to the Ethereum mainnet using your preferred deployment tool (e.g., Hardhat or Truffle).

   Example deployment command with **Hardhat**:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

3. **Use MetaMask for Interaction**:
   After deployment, users can interact with the contracts using **MetaMask** or other Ethereum-compatible wallets. Ensure the PYUSD token is available for interactions.

---

## How It Works

1. **User Insures an NFT**:
   - The user specifies the NFT to be insured, along with its insured value.
   - The premium is calculated based on the insured value and the risk factor provided by oracles.

2. **Liquidity Providers Deposit PYUSD**:
   - Liquidity providers deposit **PYUSD** tokens into the pool, which is used to pay claims and rewards.

3. **Premium Payments and Rewards**:
   - The user pays monthly premiums in **PYUSD**, which go into the liquidity pool.
   - Liquidity providers earn rewards proportional to their contributions.

4. **Claim Processing**:
   - In the event of an insured incident (e.g., theft or loss), the user can claim the insured amount.
   - The liquidity pool processes the claim and transfers the insured amount in **PYUSD** to the user.

---

## Technologies Used

- **Solidity**: Smart contract programming language.
- **OpenZeppelin**: Secure, reusable smart contract standards (ERC-20, Ownable, ReentrancyGuard).
- **MetaMask**: Ethereum wallet for interacting with the dApp.
- **Hardhat**: Ethereum development environment for contract compilation, deployment, and testing.

---

## Security Considerations

- The contract uses **ReentrancyGuard** from OpenZeppelin to prevent reentrancy attacks.
- **Ownable** ensures that only the contract owner can distribute rewards or add/remove pool participants.
- **Oracle Integration** is secured through trusted sources like Chainlink to avoid external manipulation.

---

## Future Improvements

- **Multiple Token Support**: In future iterations, the liquidity pool could support multiple stablecoins (e.g., USDC, DAI).
- **Dynamic Premium Adjustments**: Use advanced oracle data to dynamically adjust premiums based on real-time market and asset risk conditions.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For more information, feel free to reach out.
