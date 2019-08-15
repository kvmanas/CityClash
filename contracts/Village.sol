pragma solidity ^0.5.0;
import "./Ownable.sol";
import "./ICityClash.sol";
import "./SafeMath.sol";

contract Village is Ownable{
    using SafeMath for uint256;
    struct TroopsModel{
        uint256 Count;
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
    struct QueueModel{
        uint256 ID;
        uint256 Count;
        uint256 Time;
        uint256 Attack;
        uint256 Defence;
        uint256 Steal;
    }
    mapping(uint256 => QueueModel)  TroopsQueue;
    uint256 public CompletedQueue;
    uint256 public TotalQueue;
    uint256 public completionTime;
    address payable private CCgame;
    constructor(address payable _CCgame) public{
        CCgame = _CCgame;
        UserDetails.GoldRate = 1;
        UserDetails.ElixrRate = 1;
    }
    modifier isVillageOwner() {
        require(ICityClash(CCgame).GetVillageOwner(address(this)) == msg.sender,"User is not Village owner");
        _;
    }

    function UpgradeBuilding(uint256 _ID, uint256 _level) public isVillageOwner{
        require(UserDetails.Buildings[_ID].Level == _level.sub(1),"Invalid Upgrade");
        (uint256 _RequiredBuilding, uint256 _RequiredLevel, uint256 _RequiredGold, uint256 _RequiredElixr,
        uint256 _RequiredGem, uint256 _GoldRate, uint256 _ElixrRate, uint256 _GemReward, uint256 _Time ) =
        ICityClash(CCgame).GetBuildingUpgrades(_ID,_level);
        require(_Time > 0,"no upgrades available");
        require(UserDetails.Buildings[_ID].CoolOff < now, "Upgrading in Process");
        require(UserDetails.Buildings[_RequiredBuilding].Level >= _RequiredLevel, "Building Requirement not met");
        UpdateUserResources();
        require(UserDetails.Gold >= _RequiredGold && UserDetails.Elixr >= _RequiredElixr,
         "Resources Requirement not met");
        UserDetails.Gold = UserDetails.Gold.sub(_RequiredGold);
        UserDetails.Elixr = UserDetails.Elixr.sub(_RequiredElixr);
        if(_RequiredGem > 0){
            require(ICityClash(CCgame).SubGemFromVillage(msg.sender,_RequiredGem),"No Gem Balance");
        }
        UpdateUserTroops();
        UserDetails.GoldRate = UserDetails.GoldRate.add(_GoldRate);
        UserDetails.ElixrRate = UserDetails.GoldRate.add(_ElixrRate);
        UserDetails.Buildings[_ID].CoolOff = _Time.add(now);
        if(_GemReward > 0){
            require(ICityClash(CCgame).AddGemFromVillage(msg.sender,_GemReward),"Something Went Wrong");
        }
    }

     function TrainTroops(uint256 _ID, uint256 _count) public isVillageOwner{
        (uint256 _Defence, uint256 _Attack, uint256 _Steal, uint256 _RequiredGold,
        uint256 _RequiredElixr, uint256 _RequiredGem, uint256 _Time) =
        ICityClash(CCgame).GetToopsDetails(_ID);
        require(_Time > 0,"no troop available");
        UpdateUserResources();
        require(UserDetails.Gold >= _RequiredGold.mul(_count) && UserDetails.Elixr >=
        _RequiredElixr.mul(_count),"Resources Requirement not met");
        UserDetails.Gold = UserDetails.Gold.sub(_RequiredGold.mul(_count));
        UserDetails.Elixr = UserDetails.Elixr.sub(_RequiredElixr.mul(_count));
        if(_RequiredGem > 0){
            require(ICityClash(CCgame).SubGemFromVillage(msg.sender,_RequiredGem),"No Gem Balance");
        }
        UpdateUserTroops();
        if(completionTime < now){
            completionTime = now;
        }
        QueueModel memory Queue;
        Queue.ID = _ID;
        Queue.Count = _count;
        Queue.Time = completionTime.add(_count.mul(_Time));
        Queue.Attack = _Attack.mul(_count);
        Queue.Defence = _Defence.mul(_count);
        Queue.Steal = _Steal.mul(_count);
        TroopsQueue[TotalQueue] = Queue;
        TotalQueue++;
    }

    function UpdateUserResources() internal{
        uint256 currentTime = now;
        UserDetails.Gold += UserDetails.GoldRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.Elixr += UserDetails.ElixrRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.TimeStamp = currentTime;
    }
    function UpdateUserTroops() internal{
        for(uint256 i = CompletedQueue; i < TotalQueue && TroopsQueue[i].Time < now ; i++){
            UserDetails.Attack = UserDetails.Attack.add(TroopsQueue[i].Attack);
            UserDetails.Defence = UserDetails.Defence.add(TroopsQueue[i].Defence);
            UserDetails.Steal = UserDetails.Steal.add(TroopsQueue[i].Steal);
            UserDetails.Troops[TroopsQueue[i].ID].Count = UserDetails.Troops[TroopsQueue[i].ID].Count.add(TroopsQueue[i].Count);
            CompletedQueue++;
        }
    }
    function DestroyVillage() external onlyOwner{
        selfdestruct(CCgame);
    }

}