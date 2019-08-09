pragma solidity ^0.5.0;
import "./Ownable.sol";
import "./Village.sol";
import "./ERC20.sol";
import "./IERC20.sol";
import "./CC-modifiers.sol";

contract CityClash is Ownable , CCmodifiers{
    address public CityToken;
    uint256 public TownBasicPrice;
    uint256 public SellCommission;
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
        uint256 NumberOfTown = Game.getPlayerTowns().length;
        uint256 GemsRequired = NumberOfTown.mul(TownBasicPrice ** NumberOfTown);
        Game.subThisPlayerGems(GemsRequired);
        Game.addPlayerGems(address(this),GemsRequired);
        address NewTown = address(new Village());
        Game.Villages.push(NewTown);
        Game.addPlayerVillage(NewTown);
    }
    /**
    * This function handles creation of new village
    * Requires Gems to create new village.
    * Required Gems = (Number of Villages hold by user) * [(Town Basic Price) ** (Number of Villages hold by user)]
    * @param _village address of village to destroy
    * @param _position position of village to destroy
    */
    function DestroyUserVillage(address _village,uint256 _position) public isVillageOwner(_village)
    isArrayIndex(Game.getPlayerTowns(),_position) {
        //check provided position and index corresponding to village
        isSameAddress(Game.getPlayerTowns()[_position],_village);
        Village(_village).DestroyVillage();
        Game.VillageOwner[_village] = address(0);
        Game.Players[msg.sender].Towns[_position] = Game.getPlayerTowns()[Game.getPlayerTowns().length - 1];
        Game.Players[msg.sender].Towns.pop();
    }
    /**
    * This function used to sell village
    * @param _village address of village to sell
    * @param _amount sell price
    * @param _position Village position on User Town list
    */
    function SellUserVillage(address _village, uint256 _amount, uint256 _position) public isVillageOwner(_village)
    isArrayIndex(Game.getPlayerTowns(),_position){
        require(_amount > 0, "must be greater than zero");
        //check provided position and index corresponding to village
        isSameAddress(Game.getPlayerTowns()[_position],_village);
        CClibrary.MarketOrders memory Order;
        Order.SellVillage = _village;
        Order.Seller = msg.sender;
        Order.SellPrice = _amount;
        Order.TownPosition = _position;
        Game.SellOrders.push(Order);
        Game.VillageOwner[_village] = address(this);
    }
    /**
    * This function used to cancel sell village order
    * @param _position Array Index of Sell Orders list
    */
    function CancelSellOrder(uint256 _position) public isArrayLength(Game.SellOrders.length,_position){
        CClibrary.MarketOrders memory village = Game.SellOrders[_position];
        //check village belongs to contract address
        // if village not belongs to contract = already filled or cancelled order
        isSameAddress(Game.VillageOwner[village.SellVillage],address(this));
        //check Order is made by this user
        isSameAddress(village.Seller, msg.sender);
        Game.SellOrders[_position].IsFilled = true;
        Game.VillageOwner[village.SellVillage] = msg.sender;
    }
    /**
    * This function used to buy another user village
    * @param _position Array Index of Sell Orders list
    */
    function BuyUserVillage(uint256 _position) public payable isArrayLength(Game.SellOrders.length,_position)
    {
        CClibrary.MarketOrders memory village = Game.SellOrders[_position];
        isSameAddress(Game.VillageOwner[village.SellVillage],address(this));
        //check Order is not made by User
        isNotSameAddress(village.Seller,msg.sender);
        isSameValue(msg.value,village.SellPrice);
        uint256 NumberOfTown = Game.getPlayerTowns().length;
        uint256 GemsRequired = NumberOfTown.mul(TownBasicPrice ** NumberOfTown).div(2);
        Game.subThisPlayerGems(GemsRequired);
        uint256 GemtoSeller = GemsRequired.mul(SellCommission).div(100);
        uint256 GemtoContract = GemsRequired.sub(GemtoSeller);
        Game.addPlayerGems(village.Seller,GemtoSeller);
        Game.addPlayerGems(address(this),GemtoContract);
        village.Seller.transfer(msg.value);
        Game.SellOrders[_position].IsFilled = true;
        Game.addPlayerVillage(village.SellVillage);
        Game.Players[village.Seller].Towns[village.TownPosition] = Game.Players[village.Seller].Towns[ Game.Players[village.Seller].Towns.length - 1 ];
        Game.Players[village.Seller].Towns.pop();
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
        Game.addPlayerGems(msg.sender,_amount);
    }
    /**
    *This function handles withdrawals of Gems from the contract.
    * If token transfer fails, transaction is reverted and remaining gas is refunded.
    * @param _amount uint of the amount of the token the user wishes to withdraw
    */
    function withdrawGems(uint256 _amount) public HaveGem(_amount) {
        Game.subThisPlayerGems(_amount);
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
     /**
    *This function handles changing of Town sell commission in Gems.
    * Only Owner  can execute this function.
    * @param _value  sell commision in percentage
    */
    function changeSellCommission(uint256 _value) public onlyOwner{
        require(_value >= 0 && _value <= 100, "Value must be b/w 0 to 100");
        SellCommission = _value;
    }

}