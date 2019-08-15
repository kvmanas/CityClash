pragma solidity ^0.5.0;
import "./Village.sol";
import "./ERC20.sol";
import "./Ownable.sol";


contract CClink is Ownable{
    address public CityClash;
    modifier isGame() {
        require(CityClash == msg.sender,"User is not Game");
        _;
    }
    function createVillage() public isGame returns(address){
        return(address(new Village(msg.sender)));
    }
    function destroyVillage(address _village) public isGame returns(bool){
        Village(_village).DestroyVillage();
        return true;
    }
    function createToken(uint256 initialSupply, string memory tokenName, uint8 decimalUnits,
    string memory  tokenSymbol,address payable _Owner) public isGame returns(address){
        return(address(new CityGem(initialSupply,tokenName,decimalUnits,tokenSymbol,_Owner)));
    }
    function changeCCAddress(address Game) public onlyOwner {
        CityClash = Game;
    }
}