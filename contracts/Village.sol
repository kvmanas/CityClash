pragma solidity ^0.5.0;
import "./Ownable.sol";
import "./ICityClash.sol";
import "./SafeMath.sol";

contract Village is Ownable{
    using SafeMath for uint256;
    struct TroopsModel{
        uint256 Number;
        uint256 CoolOff;
    }
    struct BuildingModel{
        uint256 Level;
        uint256 CoolOff;
    }
    struct UserModel{
        uint256 Gold;
        uint256 Elixr;
        uint256 GoldRate;
        uint256 ElixrRate;
        uint256 Attack;
        uint256 Defence;
        uint256 Steal;
        uint256 TimeStamp;
        mapping(uint256 => BuildingModel) Buildings;
        mapping(uint256 => TroopsModel) Troops;
    }
    UserModel public UserDetails;

    constructor() public{
        UserDetails.GoldRate = 1;
        UserDetails.ElixrRate = 1;
    }
    modifier isVillageOwner() {
        require(ICityClash(owner()).GetVillageOwner(address(this)) == msg.sender,"User is not Village owner");
        _;
    }

    function UpgradeBuilding(uint256 _ID, uint256 _level) public isVillageOwner{
        require(UserDetails.Buildings[_ID].Level == _level.sub(1),"Invalid Upgrade");
        (uint256 _RequiredBuilding, uint256 _RequiredLevel, uint256 _RequiredGold, uint256 _RequiredElixr,
        uint256 _RequiredGem, uint256 _GoldRate, uint256 _ElixrRate, uint256 _GemReward, uint256 _Time ) =
        ICityClash(owner()).GetBuildingUpgrades(_ID,_level);
        require(_Time > 0,"no upgrades available");
        require(UserDetails.Buildings[_ID].CoolOff < now, "Upgrading in Process");
        require(UserDetails.Buildings[_RequiredBuilding].Level >= _RequiredLevel, "Building Requirement not met");
        UpdateUserResources();
        require(UserDetails.Gold >= _RequiredGold && UserDetails.Elixr >= _RequiredElixr,
         "Resources Requirement not met");
        UserDetails.Gold = UserDetails.Gold.sub(_RequiredGold);
        UserDetails.Elixr = UserDetails.Elixr.sub(_RequiredElixr);
        if(_RequiredGem > 0){
            require(ICityClash(owner()).SubGemFromVillage(msg.sender,_RequiredGem),"No Gem Balance");
        }
        UserDetails.GoldRate = UserDetails.GoldRate.add(_GoldRate);
        UserDetails.ElixrRate = UserDetails.GoldRate.add(_ElixrRate);
        UserDetails.Buildings[_ID].CoolOff = _Time.add(now);
        if(_GemReward > 0){
            require(ICityClash(owner()).AddGemFromVillage(msg.sender,_GemReward),"Something Went Wrong");
        }
    }

     function TrainTroops(uint256 _ID, uint256 _count) public isVillageOwner{
        (uint256 _Defence, uint256 _Attack, uint256 _Steal, uint256 _RequiredGold,
        uint256 _RequiredElixr, uint256 _RequiredGem, uint256 _Time) =
        ICityClash(owner()).GetToopsDetails(_ID);
        require(_Time > 0,"no troop available");
       /////////////////////////////////////////////////////
    }

    function UpdateUserResources() internal{
        uint256 currentTime = now;
        UserDetails.Gold += UserDetails.GoldRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.Elixr += UserDetails.ElixrRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.TimeStamp = currentTime;
    }
    function DestroyVillage() external onlyOwner{
        selfdestruct(owner());
    }

}