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
    struct CCModel{
        address[] Villages;
        mapping(address => address) VillageOwner;
        mapping(address => PlayerModel) Players;
        MarketOrders[] SellOrders;
    }
    function getPlayerTowns(CCModel storage self) public view returns(address[] memory){
        return self.Players[msg.sender].Towns;
    }
    function subThisPlayerGems(CCModel storage self, uint256 _amount) internal{
        require(self.Players[msg.sender].GemsCount >= _amount, "insufficient gems");
        self.Players[msg.sender].GemsCount = self.Players[msg.sender].GemsCount.sub(_amount);
    }
    function addPlayerGems(CCModel storage self, address _user, uint256 _amount) internal {
        self.Players[_user].GemsCount = self.Players[_user].GemsCount.add(_amount);
    }
    function addPlayerVillage(CCModel storage self, address _town) internal {
        self.VillageOwner[_town] = msg.sender;
        self.Players[msg.sender].Towns.push(_town);
    }
}