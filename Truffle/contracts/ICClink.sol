pragma solidity ^0.5.0;
//CClink interface refer CClink.sol
interface ICClink{
    function createVillage() external returns(address);
    function destroyVillage(address _village) external returns(bool);
    function createToken(uint256 initialSupply, string calldata  tokenName, uint8 decimalUnits,
    string calldata tokenSymbol,address payable _Owner) external returns(address);
}