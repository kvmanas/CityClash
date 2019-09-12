pragma solidity ^0.5.0;
import "./Ownable.sol";
import "./ICityClash.sol";
import "./SafeMath.sol";

/**
 * @title Village
 * contract to store user village details
 */
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
    mapping(uint256 => QueueModel) public  TroopsQueue;
    uint256 public CompletedQueue;
    uint256 public TotalQueue;
    uint256 public completionTime;
    address payable private CCgame;
    event Battle(
       address attacker,
       address defender,
       uint256 Gold,
       uint256 Elixr,
       bool success
    );
    constructor(address payable _CCgame) public{
        CCgame = _CCgame;
        UserDetails.GoldRate = 1;
        UserDetails.ElixrRate = 1;
        UserDetails.TimeStamp = now;
    }
    // check caller is Village Owner
    modifier isVillageOwner() {
        require(ICityClash(CCgame).GetVillageOwner(address(this)) == msg.sender,"User is not Village owner");
        _;
    }
    // check caller is village
    modifier isFromVillage() {
        require(ICityClash(CCgame).GetVillageOwner(msg.sender) != address(0),"Caller is not Village");
        _;
    }
    /**
    * function to Upgrade Builing of this village
    * only village owner can execute
    * @param _ID builing ID
    * @param _level upgarade level
    */
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
        UserDetails.ElixrRate = UserDetails.ElixrRate.add(_ElixrRate);
        UserDetails.Buildings[_ID].Level = _level;
        UserDetails.Buildings[_ID].CoolOff = _Time.add(now);
        if(_GemReward > 0){
            require(ICityClash(CCgame).AddGemFromVillage(msg.sender,_GemReward),"Something Went Wrong");
        }
    }
    /**
    * function to Train troop for this village
    * only village owner can execute
    * @param _ID troop ID
    * @param _count number of troop to train
    */
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
        completionTime = Queue.Time;
        TotalQueue++;
    }
    /**
    * function to update user resources
    * internal call
    */
    function UpdateUserResources() internal{
        uint256 currentTime = now;
        UserDetails.Gold += UserDetails.GoldRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.Elixr += UserDetails.ElixrRate.mul(currentTime.sub(UserDetails.TimeStamp));
        UserDetails.TimeStamp = currentTime;
    }
    /**
    * function to update troop training
    * internal call
    */
    function UpdateUserTroops() internal{
        for(uint256 i = CompletedQueue; i < TotalQueue && TroopsQueue[i].Time < now ; i++){
            UserDetails.Attack = UserDetails.Attack.add(TroopsQueue[i].Attack);
            UserDetails.Defence = UserDetails.Defence.add(TroopsQueue[i].Defence);
            UserDetails.Steal = UserDetails.Steal.add(TroopsQueue[i].Steal);
            UserDetails.Troops[TroopsQueue[i].ID].Count = UserDetails.Troops[TroopsQueue[i].ID].Count.add(TroopsQueue[i].Count);
            CompletedQueue++;
        }
    }
    /**
    * function to Get Building details
    * @param _id Building ID
    * @return _Level current building level
    * @return _CoolOff Cool off time for next upgrade
    */
    function GetUpgradeDetails(uint256 _id) public view  returns(uint256 _Level , uint256 _CoolOff){
        _Level = UserDetails.Buildings[_id].Level;
        _CoolOff = UserDetails.Buildings[_id].CoolOff;
    }
    /**
    * function to Get troop detail
    * @param _id troop ID
    * @return _Count trained troop count
    */
    function GetTrainDetails(uint256 _id) public view  returns(uint256 _Count){
        _Count = UserDetails.Troops[_id].Count;
    }
    /**
    * function to Attack Enemy
    * only village owner can execute
    * @param _Enemy Enemy village address
    */
    function AttackEnemy(address _Enemy) public isVillageOwner{
        require(ICityClash(CCgame).GetVillageOwner(_Enemy) != address(0),"Invalid village");
        require(ICityClash(CCgame).GetVillageOwner(_Enemy) != msg.sender,"User Can't attack own village");
        UpdateUserResources();
        UpdateUserTroops();
        (uint256 _GoldSteal, uint256 _ElixrSteal) = Village(_Enemy).DefenceAttack(address(this),UserDetails.Attack, UserDetails.Steal);
         UserDetails.Gold = UserDetails.Gold.add(_GoldSteal);
         UserDetails.Elixr = UserDetails.Gold.add(_ElixrSteal);

    }
    /**
    * function to defend attack
    * only another village can execute
    * @param _Attacker attacker village address
    * @param _Attack enemy attack power
    * @param _Steal enemy steal power
    */
    function DefenceAttack(address _Attacker, uint256 _Attack, uint256 _Steal) public
    isFromVillage returns(uint256 _GoldSteal , uint256 _ElixrSteal){
        UpdateUserResources();
        UpdateUserTroops();
        bool success;
        if(_Attack >= UserDetails.Defence){
            success = true;
            if(UserDetails.Gold < _Steal){
                UserDetails.Gold = 0;
                _GoldSteal = UserDetails.Gold;
            }else{
                UserDetails.Gold = UserDetails.Gold.sub(_Steal);
                _GoldSteal = _Steal;
            }
            if(UserDetails.Elixr < _Steal){
                UserDetails.Elixr = 0;
                _ElixrSteal = UserDetails.Elixr;
            }else{
                UserDetails.Elixr = UserDetails.Elixr.sub(_Steal);
                _ElixrSteal = _Steal;
            }
        }else{
            success = false;
            _GoldSteal = 0;
            _ElixrSteal = 0;
        }
        emit Battle(_Attacker,address(this),_GoldSteal,_ElixrSteal,success);
    }
     /**
    * function to destroy village
    * only owner can call
    */
    function DestroyVillage() external onlyOwner{
        selfdestruct(CCgame);
    }

}