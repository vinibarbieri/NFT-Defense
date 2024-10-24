// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract InsuranceContract {
    struct NFT {
        address nftAddress;
        uint256 tokenId;
        uint256 insuranceAmount;
        uint256 duration;
    }

    address public owner;
    mapping(address => NFT[]) public insuredNFTs;

    event NFTInsured(address indexed user, address indexed nftAddress, uint256 tokenId, uint256 insuranceAmount, uint256 duration);
    event NFTTransferredToStorage(address indexed user, address indexed nftAddress, uint256 tokenId);

    constructor() {
        owner = msg.sender; // O criador do contrato é o proprietário
    }

    function insureNFT(address _nftAddress, uint256 _tokenId, uint256 _duration) external {
        IERC721 nftContract = IERC721(_nftAddress);
        require(nftContract.ownerOf(_tokenId) == msg.sender, "You do not own this NFT");

        uint256 insuranceAmount = calculateInsuranceValue(_nftAddress, _tokenId, _duration);
        insuredNFTs[msg.sender].push(NFT(_nftAddress, _tokenId, insuranceAmount, _duration));

        // Transfere o NFT para um armazenamento seguro
        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        emit NFTInsured(msg.sender, _nftAddress, _tokenId, insuranceAmount, _duration);
        emit NFTTransferredToStorage(msg.sender, _nftAddress, _tokenId);
    }

    function calculateInsuranceValue(address _nftAddress, uint256 _tokenId, uint256 _duration) public view returns (uint256) {
        // Lógica para calcular o valor do seguro com base no ativo e no período
        // Isso pode ser ajustado conforme necessário
        return _duration * 0.01 ether; // Exemplo: 0.01 ether por dia
    }

    function getInsuredNFTs() external view returns (NFT[] memory) {
        return insuredNFTs[msg.sender];
    }
}