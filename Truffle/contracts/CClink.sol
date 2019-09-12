pragma solidity ^0.5.0;
import "./Village.sol";
import "./ERC20.sol";
import "./Ownable.sol";

/**
 * @title CClink
 * contract to connect b/w Cityclash and Village
 */
contract CClink is Ownable{
    address public CityClash;
    // check caller is CityClash Contract
    modifier isGame() {
        require(CityClash == msg.sender,"User is not Game");
        _;
    }
    /**
    * function to create Village.
    * Only CityClash Contract  can execute this function.
    * @dev Note: this function called from CityClash contract
    */
    function createVillage() public isGame returns(address){
        return(address(new Village(msg.sender)));
    }
    /**
    * function to destroy Village.
    * Only CityClash Contract  can execute this function.
    * @dev Note: this function called from CityClash contract
    */
    function destroyVillage(address _village) public isGame returns(bool){
        Village(_village).DestroyVillage();
        return true;
    }
     /**
    * function to create ERC20 Token
    * Only CityClash Contract  can execute this function.
    * @param initialSupply total supply of token
    * @param tokenName Erc20 token Name
    * @param decimalUnits Amount of decimals for display purposes
    * @param tokenSymbol  Set the symbol for display purposes
    * @param _Owner  Owner of the ERC20 token
    * @return address of the ERC20 token
    */
    function createToken(uint256 initialSupply, string memory tokenName, uint8 decimalUnits,
    string memory  tokenSymbol,address payable _Owner) public isGame returns(address){
        return(address(new CityGem(initialSupply,tokenName,decimalUnits,tokenSymbol,_Owner)));
    }
    /**
    * function to change CityClash Contract Address.
    * Only Owner  can execute this function.
    * @param Game CityClash Contract Address
    */
    function changeCCAddress(address Game) public onlyOwner {
        CityClash = Game;
    }
}