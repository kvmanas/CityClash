pragma solidity ^0.5.0;
import "./SafeMath.sol";
/**
 * @title CityClash Library
 */
library CClibrary{
    using SafeMath for uint256;
    struct PlayerModel{
        uint256 LastAttack;
        address[] Towns;
        uint256 GemsCount;
    }
    struct MarketOrders{
        address SellVillage;
        address payable Seller;
        uint256 TownPosition;
        address Buyer;
        uint256 SellPrice;
        bool IsFilled;
    }
    struct UpgradeModel{
        uint256 RequiredBuilding;
        uint256 RequiredLevel;
        uint256 RequiredGold;
        uint256 RequiredElixr;
        uint256 RequiredGem;
        uint256 GoldRate;
        uint256 ElixrRate;
        uint256 GemReward;
        uint256 Time;
    }
    struct BuildingModel{
        bytes32 name;
        bytes32 image;
        bool state;
        mapping(uint256 => UpgradeModel) Upgrade;
    }
    struct TrainModel{
        uint256 Defence;
        uint256 Attack;
        uint256 Steal;
        uint256 RequiredGold;
        uint256 RequiredElixr;
        uint256 RequiredGem;
        uint256 Time;
        //future troop housesapce implimentaton
    }
    struct TroopsModel{
        bytes32 name;
        bytes32 image;
        TrainModel Train;
    }
    struct CCModel{
        address[] Villages;
        mapping(address => address) VillageOwner;
        mapping(address => PlayerModel) Players;
        MarketOrders[] SellOrders;
        BuildingModel[] Buildings;
        TroopsModel[] Troops;
    }
    /**
    * Get Player Town details as array
    * @param self Game
    * @return user town address
    */
    function getPlayerTowns(CCModel storage self) internal view returns(address[] memory){
        return self.Players[msg.sender].Towns;
    }
     /**
    * Substract Gem from user
    * @param self Game
    * @param _amount Gem amount to be reduced
    */
    function subPlayerGems(CCModel storage self, address _user, uint256 _amount) internal{
        require(self.Players[_user].GemsCount >= _amount, "insufficient gems");
        self.Players[_user].GemsCount = self.Players[_user].GemsCount.sub(_amount);
    }
    /**
    * Add Gem to user
    * @param self Game
    * @param _user user address
    * @param _amount Gem amount to be reduced
    */
    function addPlayerGems(CCModel storage self, address _user, uint256 _amount) internal {
        self.Players[_user].GemsCount = self.Players[_user].GemsCount.add(_amount);
    }
    /**
    * Add Town to Player Town List
    * @param self Game
    * @param _town village address to be added
    */
    function addPlayerVillage(CCModel storage self, address _town) internal {
        self.VillageOwner[_town] = msg.sender;
        self.Players[msg.sender].Towns.push(_town);
    }
}