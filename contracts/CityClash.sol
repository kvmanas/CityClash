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
    uint256 public SellCommission;
    struct MarketOrders{
        address SellVillage;
        address payable Seller;
        uint256 TownPosition;
        address Buyer;
        uint256 SellPrice;
        bool IsFilled;
    }
    MarketOrders[] public SellOrders;
    // struct BuildingModel{
    //     uint256 id;

    // }

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
    * This function used to sell village
    * @param _village address of village to sell
    * @param _amount sell price
    * @param _position Village position on User Town list
    */
    function SellUserVillage(address _village, uint256 _amount, uint256 _position) public{
        require(VillageOwner[_village] == msg.sender,"User is not Village owner");
        require(_amount > 0, "must be greater than zero");
        //check error when position greater than array
        require(Players[msg.sender].Towns[_position] == _village,"Invalid Town Index");
        MarketOrders memory Order;
        Order.SellVillage = _village;
        Order.Seller = msg.sender;
        Order.SellPrice = _amount;
        Order.TownPosition = _position;
        SellOrders.push(Order);
        VillageOwner[_village] = address(this);
    }
    /**
    * This function used to cancel sell village order
    * @param _position Array Index of Sell Orders list
    */
    function CancelSellOrder(uint256 _position) public{
        require(_position > 0 && _position < SellOrders.length,"Invalid Array Index");
        MarketOrders memory village = SellOrders[_position];
        require(VillageOwner[village.SellVillage] == address(this),"Order already filled/canceled");
        require(village.Seller == msg.sender,"Order is not Made by user");
        SellOrders[_position].IsFilled = true;
        VillageOwner[village.SellVillage] = msg.sender;
    }
    /**
    * This function used to buy another user village
    * @param _position Array Index of Sell Orders list
    */
    function BuyUserVillage(uint256 _position) public payable{
        require(_position > 0 && _position < SellOrders.length,"Invalid Array Index");
        MarketOrders memory village = SellOrders[_position];
        require(VillageOwner[village.SellVillage] == address(this),"Order already filled/canceled");
        require(village.Seller != msg.sender,"Order Made by user, use Cancel Order insted");
        require(msg.value == village.SellPrice,"Price not matched");
        village.Seller.transfer(msg.value);
        SellOrders[_position].IsFilled = true;
        VillageOwner[village.SellVillage] = msg.sender;
        Players[msg.sender].Towns.push(village.SellVillage);
        Players[village.Seller].Towns[village.TownPosition] = address(0);
        //impliment gem reducton from user and give seller gem  , deduct commission from seller
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