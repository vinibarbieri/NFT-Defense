// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Insurance is Ownable {
    constructor() Ownable(msg.sender) {}
    
    struct InsurancePolicy {
        address insured;           // Endereço do usuário que comprou o seguro
        address nftAddress;        // Endereço do contrato NFT
        uint256 insuredAmount;     // Valor segurado do NFT
        uint256 monthlyPremium;    // Valor que o assegurado paga mensalmente
        bool active;               // Se o seguro está ativo
        bool claimed;              // Se o seguro foi acionado
    }

    mapping(uint256 => InsurancePolicy) public policies; // Armazena as apólices de seguro
    uint256 public nextPolicyId;  // ID único para cada apólice de seguro

    event PolicyCreated(uint256 policyId, address insured, address nftAddress, uint256 insuredAmount, uint256 monthlyPremium);
    event PremiumPaid(uint256 policyId, uint256 amount);
    event InsuranceClaimed(uint256 policyId, uint256 insuredAmount);

    // Função para criar uma apólice de seguro para um NFT
    function createPolicy(address _nftAddress, uint256 _insuredAmount, uint256 _riskFactor) external returns (uint256) {
        // Cálculo do prêmio mensal com base no valor do NFT e no fator de risco (via oráculo)
        uint256 monthlyPremium = calculateMonthlyPremium(_insuredAmount, _riskFactor);

        // Criação da apólice de seguro
        InsurancePolicy memory newPolicy = InsurancePolicy({
            insured: msg.sender,
            nftAddress: _nftAddress,
            insuredAmount: _insuredAmount,
            monthlyPremium: monthlyPremium,
            active: true,
            claimed: false
        });

        policies[nextPolicyId] = newPolicy; // Armazena a nova apólice
        emit PolicyCreated(nextPolicyId, msg.sender, _nftAddress, _insuredAmount, monthlyPremium);

        nextPolicyId++; // Incrementa o ID para a próxima apólice
        return nextPolicyId - 1;
    }

    // Função que calcula o prêmio mensal com base no valor segurado e no fator de risco
    function calculateMonthlyPremium(uint256 _insuredAmount, uint256 _riskFactor) public pure returns (uint256) {
        // Exemplo simples de cálculo: taxa de 2% do valor segurado multiplicada pelo fator de risco
        uint256 premium = (_insuredAmount * 2 / 100) * _riskFactor;
        return premium;
    }

    // Função para pagar o prêmio mensal de seguro
    function payMonthlyPremium(uint256 _policyId) external payable {
        InsurancePolicy storage policy = policies[_policyId];
        require(policy.active, "Policy is not active");
        require(msg.value == policy.monthlyPremium, "Incorrect premium amount");

        // Armazenar o pagamento do prêmio no contrato
        emit PremiumPaid(_policyId, msg.value);
    }

    // Função para acionar o seguro em caso de sinistro
    function claimInsurance(uint256 _policyId) external {
        InsurancePolicy storage policy = policies[_policyId];
        require(policy.insured == msg.sender, "You are not the insured");
        require(policy.active, "Policy is not active");
        require(!policy.claimed, "Insurance already claimed");

        // Marca o seguro como acionado
        policy.claimed = true;

        // Paga o valor segurado ao assegurado
        payable(policy.insured).transfer(policy.insuredAmount);

        emit InsuranceClaimed(_policyId, policy.insuredAmount);
    }

    // Função para verificar o risco de um NFT via oráculo (simplificada para exemplo)
    function getRiskFactor(address _nftAddress) external pure returns (uint256) {
        // Aqui seria a integração com um oráculo (ex: Chainlink) para verificar o risco de roubo/problemas.
        // Neste exemplo, estamos apenas retornando um valor fixo para o fator de risco.
        return 3; // Fator de risco exemplo (pode variar de 1 a 10)
    }
}
