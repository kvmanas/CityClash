pragma solidity ^0.5.0;
import "./SafeMath.sol";
import "./Ownable.sol";
contract CityClash is Ownable{
    using SafeMath for uint;
    address private admin;
    // modifier isAdmin() {
    //     require(msg.sender == admin,"caller is not the admin");
    //     _;
    // }
}