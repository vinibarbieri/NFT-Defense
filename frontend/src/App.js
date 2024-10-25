import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './App.css';


// Defina o endereço do contrato e a ABI
const CONTRACT_ADDRESS = '0xB63E5b5ed4a4B26E037eE589D8e625A4261B117e';
const TOKEN_ADDRESS = '0xFB8CB43c9A55336ACDB20751CF3F554AFA2dc91B';
const CONTRACT_ABI = [ {
  "inputs": [
    {
      "internalType": "address",
      "name": "_token",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "_insuranceContract",
      "type": "address"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  "name": "OwnableInvalidOwner",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "OwnableUnauthorizedAccount",
  "type": "error"
},
{
  "inputs": [],
  "name": "ReentrancyGuardReentrantCall",
  "type": "error"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "policyId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amountPaid",
      "type": "uint256"
    }
  ],
  "name": "ClaimProcessed",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "rewards",
      "type": "uint256"
    }
  ],
  "name": "ClaimRewards",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "Deposit",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "totalRewards",
      "type": "uint256"
    }
  ],
  "name": "DistributeRewards",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "insured",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "InsuranceClaimPaid",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "insured",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "InsurancePaymentReceived",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "policyId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "PremiumPaid",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "user",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "Withdraw",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_policyId",
      "type": "uint256"
    }
  ],
  "name": "addPolicyToPool",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  "name": "deposit",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "distributeRewards",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "insuranceContract",
  "outputs": [
    {
      "internalType": "contract Insurance",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "nextPolicyId",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_policyId",
      "type": "uint256"
    }
  ],
  "name": "payPremiumToPool",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "poolPolicies",
  "outputs": [
    {
      "internalType": "address",
      "name": "insured",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "nftAddress",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "insuredAmount",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "monthlyPremium",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "active",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "claimed",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_policyId",
      "type": "uint256"
    }
  ],
  "name": "processClaim",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "token",
  "outputs": [
    {
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "totalPoolBalance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "totalPoolStats",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "totalRewards",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "userAddresses",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "users",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "balance",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "rewards",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "depositTime",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  "name": "withdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
} ];
const ERC20_ABI = [
  
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];


function App() {
  // Variáveis de estado para armazenar valores dinamicamente
  const [provider, setProvider] = useState(null);  // Provedor da conexão com blockchain
  const [signer, setSigner] = useState(null);  // O "signer" é a conta conectada via MetaMask
  const [contract, setContract] = useState(null);  // Instância do contrato de liquidez
  const [tokenContract, setTokenContract] = useState(null);  // Instância do contrato do token PYUSD
  const [account, setAccount] = useState('');  // Endereço da carteira do usuário
  const [balance, setBalance] = useState('');  // Saldo total da pool
  const [approveAmount, setApproveAmount] = useState('');  // Quantidade para aprovação
  const [depositAmount, setDepositAmount] = useState('');  // Quantidade para depósito
  const [withdrawAmount, setWithdrawAmount] = useState('');  // Quantidade para retirada
  const [notification, setNotification] = useState('');  // Notificação para o usuário

  // Função para conectar a MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const newProvider = new BrowserProvider(window.ethereum);  // Cria uma nova instância do provider
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  // Solicita a conexão da MetaMask
      const newSigner = await newProvider.getSigner();  // Pega o "signer" da carteira conectada
      const newContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);  // Instancia o contrato de liquidez

      setProvider(newProvider);  // Atualiza o provider
      setSigner(newSigner);  // Atualiza o "signer"
      setContract(newContract);  // Atualiza o contrato
      setAccount(accounts[0]);  // Salva o endereço da conta conectada

      // Carrega o contrato do token PYUSD
      const newTokenContract = new Contract(TOKEN_ADDRESS, ERC20_ABI, newSigner);
      setTokenContract(newTokenContract);
    } else {
      alert('MetaMask is not installed');  // Exibe uma mensagem de erro se a MetaMask não estiver instalada
    }
  };

  // useEffect para monitorar e atualizar o saldo da pool periodicamente
  useEffect(() => {
    if (contract) {
      const updateBalance = async () => {
        const poolBalance = await contract.totalPoolStats();  // Chama a função que retorna o saldo total da pool
        setBalance(formatUnits(poolBalance, 18));  // Converte o saldo de wei (18 decimais) para tokens
      };

      updateBalance();  // Atualiza o saldo logo após conectar o contrato
      const interval = setInterval(updateBalance, 10000);  // Atualiza o saldo a cada 10 segundos
      return () => clearInterval(interval);  // Limpa o intervalo quando o componente é desmontado
    }
  }, [contract]);

  // Função para aprovar tokens PYUSD para o contrato
  const approveTokens = async (amount) => {
    if (tokenContract) {
      try {
        setNotification('Transaction in progress: Approving tokens...');
        const tx = await tokenContract.approve(CONTRACT_ADDRESS, parseUnits(amount, 18));  // Chama a função approve
        await tx.wait();  // Espera a confirmação da transação
        setNotification('Tokens approved successfully!');
      } catch (error) {
        console.error('Error during approval:', error);
        setNotification('Approval failed. Please try again.');
      }
    }
  };

  // Função para depositar tokens na pool de liquidez
  const depositTokens = async (amount) => {
    if (contract) {
      try {
        setNotification('Transaction in progress: Depositing tokens...');
        const tx = await contract.deposit(parseUnits(amount, 18));  // Converte para 18 decimais antes de enviar
        await tx.wait();  // Espera a confirmação da transação
        setNotification('Deposit successful!');
      } catch (error) {
        console.error('Error during deposit:', error);
        setNotification('Deposit failed. Please try again.');
      }
    }
  };

  // Função para retirar tokens da pool de liquidez
  const withdrawTokens = async (amount) => {
    if (contract) {
      try {
        setNotification('Transaction in progress: Withdrawing tokens...');
        const tx = await contract.withdraw(parseUnits(amount, 18));  // Converte para 18 decimais
        await tx.wait();  // Espera a confirmação da transação
        setNotification('Withdraw successful!');
      } catch (error) {
        console.error('Error during withdraw:', error);
        setNotification('Withdraw failed. Please try again.');
      }
    }
  };

  // Função para abreviar o endereço da carteira (Ex: 0x123...456)
  const shortenAddress = (address) => {
    return address ? `${address}` : '';
  };

  return (
    <div className="App" style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <div className="container text-center">
        <header className="my-4">
          <h1 style={{ color: '#00d1b2', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', fontSize: '3rem' }}>
            NFT Insurance Liquidity Pool
          </h1>
        </header>

        {/* Se a carteira ainda não estiver conectada, exibe o botão para conectar */}
        {!account ? (
          <div className="text-center mb-4">
            <button className="btn btn-primary btn-lg" onClick={connectWallet}>
              <FaWallet /> Connect Wallet
            </button>
          </div>
        ) : (
          // Exibe a carteira conectada
          <div className="wallet-info mb-4 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#282828', padding: '10px', borderRadius: '10px' }}>
            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Network" width="24" style={{ marginRight: '10px' }} />
            <span style={{ fontSize: '1.2rem', color: '#00d1b2', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
              {shortenAddress(account)}
            </span>
          </div>
        )}

        {/* Exibe o saldo da pool */}
        <div className="balance-info mb-5">
          <div style={{
            background: '#00695c',
            backgroundSize: '200% 200%',
            animation: 'backgroundMove 5s linear infinite',  // Animação de gradiente sutil
            borderRadius: '15px',
            padding: '25px',
            fontSize: '3rem',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Pool Balance: {balance} PYUSD
          </div>
        </div>

        <div className="row justify-content-center">
          {/* Aprovação de tokens */}
          <div className="col-md-3 mb-3">
            <div className="card" style={{ backgroundColor: '#333', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out' }}>
              <h3 className="text-center" style={{ color: '#f39c12', fontFamily: 'Poppins, sans-serif' }}>Approve Tokens</h3>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Amount to approve"
                onChange={(e) => setApproveAmount(e.target.value)}
              />
              <button className="btn btn-warning w-100" onClick={() => approveTokens(approveAmount)}>
                <FaArrowUp /> Approve
              </button>
            </div>
          </div>

          {/* Depósito de tokens */}
          <div className="col-md-3 mb-3">
            <div className="card" style={{ backgroundColor: '#333', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out' }}>
              <h3 className="text-center" style={{ color: '#28a745', fontFamily: 'Poppins, sans-serif' }}>Deposit Tokens</h3>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Amount to deposit"
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <button className="btn btn-success w-100" onClick={() => depositTokens(depositAmount)}>
                <FaArrowUp /> Deposit
              </button>
            </div>
          </div>

          {/* Retirada de tokens */}
          <div className="col-md-3 mb-3">
            <div className="card" style={{ backgroundColor: '#333', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out' }}>
              <h3 className="text-center" style={{ color: '#dc3545', fontFamily: 'Poppins, sans-serif' }}>Withdraw Tokens</h3>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Amount to withdraw"
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <button className="btn btn-danger w-100" onClick={() => withdrawTokens(withdrawAmount)}>
                <FaArrowDown /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Exibe notificações de transações */}
        {notification && (
          <div className="alert alert-info mt-4" role="alert">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;