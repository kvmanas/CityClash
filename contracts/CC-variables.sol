pragma solidity ^0.5.0;
import "./CC-library.sol";
contract CCvariables{
    using CClibrary for CClibrary.CCModel;
    CClibrary.CCModel Game;
    using SafeMath for uint256;

    /**
    * function to Get Player Details .
    * @param _player  Player Address
    * @return _Towns Player TownList
    * @return _LastAttack Player last attack timestamp
    * @return _GemsCount Player  Gem balance
    */
    function GetPlayerDetails(address _player) public view  returns(address[] memory _Towns , uint256 _LastAttack , uint256 _GemsCount){
        _Towns = Game.Players[_player].Towns;
        _LastAttack = Game.Players[_player].LastAttack;
        _GemsCount = Game.Players[_player].GemsCount;
    }
    function GetPlayerGems(address _player) public view  returns(uint256 _GemsCount){
        _GemsCount = Game.Players[_player].GemsCount;
    }
    /**
    * function to Get All Villages .
    * @return  Villages
    */
    function GetVillages() public view returns(address[] memory){
        uint256 j;
        for (uint256 i = 0; i < Game.Villages.length; i++) {
            if(GetVillageOwner(Game.Villages[i]) != address(0)){
                j++;
            }
        }
        address[] memory _villages = new address[](j);
        j = 0;
        for (uint256 i = 0; i < Game.Villages.length; i++) {
            if(GetVillageOwner(Game.Villages[i]) != address(0)){
                 _villages[j] = Game.Villages[i];
                 j++;
            }
        }
        return _villages;
    }
   /**
    * function to Get Village owner .
    * @param _village Village address
    * @return Village owner address
    */
    function GetVillageOwner(address _village) public view returns(address){
        return Game.VillageOwner[_village];
    }
    /**
    * function to Get Filled Sell Orders .
    * @return village address list
    * @return seller address list
    * @return this village position in seller town list
    * @return sell price list
    */
    function GetAvailableSellOrders() public view returns(address[] memory,address[] memory,uint256[] memory,uint256[] memory, uint256[] memory){
        uint256 j;
        for (uint256 i = 0; i < Game.SellOrders.length; i++) {
            if(!Game.SellOrders[i].IsFilled){
                j++;
            }
        }
        address[] memory _SellVillage = new address[](j);
        address[] memory _Seller = new address[](j);
        uint256[] memory _TownPosition = new uint256[](j);
        uint256[] memory _SellPrice = new uint256[](j);
        uint256[] memory _Position = new uint256[](j);
        j = 0;
        for (uint256 i = 0; i < Game.SellOrders.length; i++) {
            if(!Game.SellOrders[i].IsFilled){
                _SellVillage[j] = Game.SellOrders[i].SellVillage;
                _Seller[j] = Game.SellOrders[i].Seller;
                _TownPosition[j] = Game.SellOrders[i].TownPosition;
                _SellPrice[j] = Game.SellOrders[i].SellPrice;
                _Position[j] = i;
                j++;
            }
        }
        return (_SellVillage, _Seller, _TownPosition, _SellPrice, _Position);
    }
    /**
    * function to Get Filled Sell Orders .
    * @return village address list
    * @return seller address list
    * @return buyer address list
    * @return sell price list
    */
    function GetFilledSellOrders() public view returns(address[] memory,address[] memory,address[] memory,uint256[] memory,uint256[] memory){
        uint256 j;
        for (uint256 i = 0; i < Game.SellOrders.length; i++) {
            if(Game.SellOrders[i].IsFilled){
                j++;
            }
        }
        address[] memory _SellVillage = new address[](j);
        address[] memory _Seller = new address[](j);
        address[] memory _Buyer = new address[](j);
        uint256[] memory _SellPrice = new uint256[](j);
        uint256[] memory _Position = new uint256[](j);
        j = 0;
        for (uint256 i = 0; i < Game.SellOrders.length; i++) {
            if(Game.SellOrders[i].IsFilled){
                _SellVillage[j] = Game.SellOrders[i].SellVillage;
                _Seller[j] = Game.SellOrders[i].Seller;
                _Buyer[j] = Game.SellOrders[i].Buyer;
                _SellPrice[j] = Game.SellOrders[i].SellPrice;
                _Position[j] = i;
                j++;
            }
        }
        return (_SellVillage, _Seller, _Buyer, _SellPrice, _Position);
    }

    function GetBuildingUpgrades(uint256 _ID, uint256 _level) public view
    returns(uint256 _RequiredBuilding, uint256 _RequiredLevel, uint256 _RequiredGold, uint256 _RequiredElixr,
    uint256 _RequiredGem, uint256 _GoldRate, uint256 _ElixrRate, uint256 _GemReward, uint256 _Time){
        _RequiredBuilding = Game.Buildings[_ID].Upgrade[_level].RequiredBuilding;
        _RequiredLevel = Game.Buildings[_ID].Upgrade[_level].RequiredLevel;
        _RequiredGold = Game.Buildings[_ID].Upgrade[_level].RequiredGold;
        _RequiredElixr = Game.Buildings[_ID].Upgrade[_level].RequiredElixr;
        _RequiredGem = Game.Buildings[_ID].Upgrade[_level].RequiredGem;
        _GoldRate = Game.Buildings[_ID].Upgrade[_level].GoldRate;
        _ElixrRate = Game.Buildings[_ID].Upgrade[_level].ElixrRate;
        _GemReward = Game.Buildings[_ID].Upgrade[_level].GemReward;
        _Time = Game.Buildings[_ID].Upgrade[_level].Time;
    }
    function GetToopsDetails(uint256 _ID) public view
    returns(uint256 _Defence, uint256 _Attack, uint256 _Steal, uint256 _RequiredGold,
    uint256 _RequiredElixr, uint256 _RequiredGem, uint256 _Time){
        _Defence = Game.Troops[_ID].Train.Defence;
        _Attack = Game.Troops[_ID].Train.Attack;
        _Steal = Game.Troops[_ID].Train.Steal;
        _RequiredGold = Game.Troops[_ID].Train.RequiredGold;
        _RequiredElixr = Game.Troops[_ID].Train.RequiredElixr;
        _RequiredGem = Game.Troops[_ID].Train.RequiredGem;
        _Time = Game.Troops[_ID].Train.Time;
    }
    function GetBuildings() public view returns(uint256[] memory ,bytes32[] memory,bytes32[] memory){
        uint256 j;
        for (uint256 i = 0; i < Game.Buildings.length; i++) {
            if(Game.Buildings[i].state){
                j++;
            }
        }
        bytes32[] memory _name = new bytes32[](j);
        bytes32[] memory _image = new bytes32[](j);
        uint256[] memory _id = new uint256[](j);
        j = 0;
        for (uint256 i = 0; i < Game.Buildings.length; i++) {
            if(Game.Buildings[i].state){
                _id[j] = i;
                _name[j] = Game.Buildings[i].name;
                _image[j] = Game.Buildings[i].image;
                j++;
            }
        }
        return (_id,_name, _image);
    }
    function GetTroops() public view returns(uint256[] memory ,bytes32[] memory,bytes32[] memory){
        uint256 j;
        for (uint256 i = 0; i < Game.Troops.length; i++) {
            if(Game.Troops[i].state){
                j++;
            }
        }
        bytes32[] memory _name = new bytes32[](j);
        bytes32[] memory _image = new bytes32[](j);
        uint256[] memory _id = new uint256[](j);
        j = 0;
        for (uint256 i = 0; i < Game.Troops.length; i++) {
            if(Game.Troops[i].state){
                _id[j] = i;
                _name[j] = Game.Troops[i].name;
                _image[j] = Game.Troops[i].image;
                j++;
            }
        }
        return (_id,_name, _image);
    }
}