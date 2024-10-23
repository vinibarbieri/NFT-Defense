// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Insurance.sol";

contract LiquidityPoolInsurance is Ownable(msg.sender), ReentrancyGuard {
    IERC20 public token;  // Token da pool (exemplo: PYUSD)
    Insurance public insuranceContract;  // Instância do contrato de seguro
    
    struct User {
        uint256 balance;       // Saldo do usuário na pool
        uint256 rewards;       // Recompensas acumuladas
        uint256 depositTime;   // Tempo do último depósito (para cálculo de recompensas)
    }

    struct PolicyInfo {
        address insured;           // Endereço do assegurado
        address nftAddress;        // Endereço do contrato NFT
        uint256 insuredAmount;     // Valor segurado do NFT
        uint256 monthlyPremium;    // Valor que o assegurado paga mensalmente
        bool active;               // Se o seguro está ativo
        bool claimed;              // Se o seguro foi acionado (sinistro)
    }

    mapping(address => User) public users;  // Armazena informações dos provedores de liquidez
    address[] public userAddresses;  // Lista de endereços dos provedores de liquidez
    mapping(uint256 => PolicyInfo) public poolPolicies; // Armazena as apólices herdadas da pool de liquidez
    uint256 public totalPoolBalance;
    uint256 public totalRewards;
    uint256 public nextPolicyId;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ClaimRewards(address indexed user, uint256 rewards);
    event DistributeRewards(uint256 totalRewards);
    event InsurancePaymentReceived(address indexed insured, uint256 amount);
    event InsuranceClaimPaid(address indexed insured, uint256 amount);
    event PremiumPaid(uint256 policyId, uint256 amount);
    event ClaimProcessed(uint256 policyId, uint256 amountPaid);

    constructor(address _token, address _insuranceContract) {
        token = IERC20(_token);  // Endereço do token (ex: PYUSD)
        insuranceContract = Insurance(_insuranceContract);  // Conecta ao contrato de seguro
    }

    // Função para o provedor de liquidez depositar tokens na pool
    function deposit(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient token balance");

        token.transferFrom(msg.sender, address(this), _amount);

        // Atualiza o saldo do usuário e o saldo total da pool
        users[msg.sender].balance += _amount;
        users[msg.sender].depositTime = block.timestamp;
        totalPoolBalance += _amount;

        emit Deposit(msg.sender, _amount);
    }

    // Função para o provedor de liquidez retirar seus tokens
    function withdraw(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(users[msg.sender].balance >= _amount, "Insufficient balance");

        users[msg.sender].balance -= _amount;
        totalPoolBalance -= _amount;

        token.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    // Função para herdar apólices do contrato de seguro
    function addPolicyToPool(uint256 _policyId) external {
        // Pega a apólice do contrato de seguro
        (address insured, address nftAddress, uint256 insuredAmount, uint256 monthlyPremium, bool active, bool claimed) = insuranceContract.policies(_policyId);
        
        // Armazena os detalhes da apólice na pool
        poolPolicies[_policyId] = PolicyInfo({
            insured: insured,
            nftAddress: nftAddress,
            insuredAmount: insuredAmount,
            monthlyPremium: monthlyPremium,
            active: active,
            claimed: claimed
        });

        nextPolicyId++;
    }

    // Função para o pagamento de prêmios à pool de liquidez
    function payPremiumToPool(uint256 _policyId) external nonReentrant {
        PolicyInfo storage policy = poolPolicies[_policyId];
        require(policy.active, "Policy is not active");

        // Transferência do token para a pool de liquidez como pagamento do prêmio
        require(token.transferFrom(msg.sender, address(this), policy.monthlyPremium), "Token transfer failed");
        totalPoolBalance += policy.monthlyPremium;
        totalRewards += policy.monthlyPremium;

        emit PremiumPaid(_policyId, policy.monthlyPremium);
    }

    // Função para processar um sinistro e pagar ao assegurado
    function processClaim(uint256 _policyId) external nonReentrant {
        PolicyInfo storage policy = poolPolicies[_policyId];
        require(policy.active, "Policy is not active");
        require(!policy.claimed, "Claim already processed");

        // Pagamento do sinistro ao assegurado
        require(token.transfer(policy.insured, policy.insuredAmount), "Token transfer failed");
        totalPoolBalance -= policy.insuredAmount;

        // Marca o seguro como acionado
        policy.claimed = true;

        emit ClaimProcessed(_policyId, policy.insuredAmount);
    }

    // Função administrativa para distribuir recompensas entre os provedores de liquidez
    function distributeRewards() external onlyOwner {
        require(totalRewards > 0, "No rewards to distribute");

        // Calcula e distribui as recompensas proporcionalmente ao saldo do usuário na pool
        for (uint256 i = 0; i < userAddresses.length; i++) {
            address account = userAddresses[i];
            User storage user = users[account];
            uint256 userShare = (user.balance * totalRewards) / totalPoolBalance;  // Distribuição proporcional
            user.rewards += userShare;  // Adiciona as recompensas ao saldo de recompensas do usuário
        }

        emit DistributeRewards(totalRewards);
        totalRewards = 0;  // Limpa as recompensas após a distribuição
    }

    // Função para visualizar o saldo total da pool
    function totalPoolStats() external view returns (uint256) {
        return totalPoolBalance;
    }
}
