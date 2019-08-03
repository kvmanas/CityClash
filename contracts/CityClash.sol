pragma solidity ^0.5.0;
import "./SafeMath.sol";
import "./Ownable.sol";
import "./Village.sol";
import "./ERC20.sol";
import "./IERC20.sol";
contract CityClash is Ownable{
    using SafeMath for uint256;
    address[] public Villages;
    struct PlayerModel{
        uint256 LastAttack;
        address[] Towns;
        uint256 GemsCount;
    }
    mapping(address => address) public VillageOwner;
    mapping(address => PlayerModel) public Players;
    address public CityToken;
    uint256 private TownBasicPrice;
    constructor( uint256 initialSupply,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol) public{
            CityToken = address(new CityGem(initialSupply,tokenName,decimalUnits,tokenSymbol,msg.sender));

    }
    /**
    * This function handles creation of new village
    * Requires Gems to create new village.
    * Required Gems = (Number of Villages hold by user) * [(Town Basic Price) ** (Number of Villages hold by user)]
    */
    function CreateVillage() public{
        uint256 NumberOfTown = Players[msg.sender].Towns.length;
        uint256 GemsRequired = NumberOfTown.mul(TownBasicPrice ** NumberOfTown);
        require(Players[msg.sender].GemsCount >= GemsRequired, "insufficient gems");
        Players[msg.sender].GemsCount = Players[msg.sender].GemsCount.sub(GemsRequired);
        address NewTown = address(new Village());
        VillageOwner[NewTown] = msg.sender;
        Villages.push(NewTown);
        Players[msg.sender].Towns.push(NewTown);
    }
    /**
    * This function handles creation of new village
    * Requires Gems to create new village.
    * Required Gems = (Number of Villages hold by user) * [(Town Basic Price) ** (Number of Villages hold by user)]
    * @param _village address of village to destroy
    */
    function DestroyUserVillage(address _village) public{
        require(VillageOwner[_village] == msg.sender,"User is not Village owner");
        Village(_village).DestroyVillage();
        VillageOwner[_village] = address(0);
    }
    /**
    * This function handles deposits of Gems to the contract.
    * If token transfer fails, transaction is reverted and remaining gas is refunded.
    * @dev Note: Remember to call Token(address).approve(this, amount) or this contract will not be able to do the transfer on your behalf.
    * @param _amount uint of the amount of the token the user wishes to deposit
    */
    function depositGems(uint256 _amount) public {
        require(IToken(CityToken).transferFrom(msg.sender, address(this), _amount),"Token Transfer Error");
        Players[msg.sender].GemsCount = Players[msg.sender].GemsCount.add(_amount);
    }
    /**
    *This function handles withdrawals of Gems from the contract.
    * If token transfer fails, transaction is reverted and remaining gas is refunded.
    * @param _amount uint of the amount of the token the user wishes to withdraw
    */
    function withdrawGems(uint256 _amount) public {
        require(Players[msg.sender].GemsCount >= _amount,"insufficient balance");
        Players[msg.sender].GemsCount = Players[msg.sender].GemsCount.sub(_amount);
        require(IToken(CityToken).transfer(msg.sender, _amount),"Token Transfer Error");
    }

    /**
    *This function handles changing of Town basic price in Gems.
    * Only Owner  can execute this function.
    * @param _value  Basic price of the town
    */
    function changeTownBasicPrice(uint256 _value) public onlyOwner{
        require(_value >= 0, "Value must be greater than zero");
        TownBasicPrice = _value;
    }

}