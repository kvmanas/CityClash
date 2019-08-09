pragma solidity ^0.5.0;
import "./CC-variables.sol";
contract CCmodifiers is CCvariables{
    //check User is Village owner
    modifier isVillageOwner(address _Village) {
        require(Game.VillageOwner[_Village] == msg.sender,"User is not Village owner");
        _;
    }
    /**
    * check User has Gem to pay
    * @param _amount Gem amount
    */
    modifier HaveGem(uint256 _amount) {
        require(Game.Players[msg.sender].GemsCount >= _amount,"insufficient balance");
        _;
    }
    /**
    * Check given index is  vaild in address array
    * @param _array address array to be checked
    * @param _position index of array
    */
    modifier isArrayIndex(address[] memory _array,uint256 _position) {
        require(_position >= 0 && _position < _array.length,"Invalid Array Index");
        _;
    }
     /**
    * Check given index is  vaild by giving array length
    * @param _length array length to be checked
    * @param _position index of array
    */
    modifier isArrayLength(uint256 _length,uint256 _position) {
        require(_position >= 0 && _position < _length,"Invalid Array Length");
        _;
    }
    // modifier isSameAddress(address _address1,address _address2) {
    //     require(_address1 == _address2,"Address not equal");
    //     _;
    // }
     /**
    * Check Two address is equal
    * @param _address1 first address
    * @param _address2 second address
    */
    function isSameAddress(address _address1,address _address2) internal pure{
        require(_address1 == _address2,"Address not equal");
    }
     /**
    * Check Two address is not equal
    * @param _address1 first address
    * @param _address2 second address
    */
    function isNotSameAddress(address _address1,address _address2) internal pure{
        require(_address1 != _address2,"Address is equal");
    }
    /**
    * Check Two uint is equal
    * @param _value1 first value
    * @param _value2 second value
    */
    function isSameValue(uint256 _value1,uint256 _value2) internal pure{
        require(_value1 == _value2,"Value not equal");
    }
}