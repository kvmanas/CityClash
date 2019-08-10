pragma solidity ^0.5.0;

interface ICityClash{
    function GetVillageOwner(address _village) external view returns(address);
    function GetBuildingUpgrades(uint256 _ID, uint256 _level) external view
    returns(uint256 _RequiredBuilding, uint256 _RequiredLevel, uint256 _RequiredGold, uint256 _RequiredElixr,
    uint256 _RequiredGem, uint256 _GoldRate, uint256 _ElixrRate, uint256 _GemReward, uint256 _Time);
    function GetPlayerGems(address _player) external view  returns(uint256 _GemsCount);
}