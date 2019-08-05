pragma solidity ^0.5.0;
import "./CC-library.sol";

contract CCmodifiers{
    using CClibrary for CClibrary.CCModel;
    CClibrary.CCModel Game;

    modifier isVillageOwner() {
        require(Game.VillageOwner[msg.sender] == msg.sender,"User is not Village owner");
        _;
    }
    modifier HaveGem(uint256 _amount) {
        require(Game.Players[msg.sender].GemsCount >= _amount,"insufficient balance");
        _;
    }
    modifier isArrayIndex(address[] memory _array,uint256 _position) {
        require(_position >= 0 && _position < _array.length,"Invalid Array Index");
        _;
    }
    modifier isArrayLength(uint256 _length,uint256 _position) {
        require(_position >= 0 && _position < _length,"Invalid Array Length");
        _;
    }
    // modifier isSameAddress(address _address1,address _address2) {
    //     require(_address1 == _address2,"Address not equal");
    //     _;
    // }
    function isSameAddress(address _address1,address _address2) internal pure{
        require(_address1 == _address2,"Address not equal");
    }
    function isNotSameAddress(address _address1,address _address2) internal pure{
        require(_address1 != _address2,"Address is equal");
    }
    function isSameValue(uint256 _value1,uint256 _value2) internal pure{
        require(_value1 == _value2,"Value not equal");
    }
}