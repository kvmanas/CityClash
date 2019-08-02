pragma solidity ^0.5.0;
import "./SafeMath.sol";
import "./Ownable.sol";
import "./Village.sol";
contract CityClash is Ownable{
    using SafeMath for uint256;
    address private admin;
    Village[] public Villages;
    struct PlayerModel{
        address User;
        uint256 LastAttack;
    }
    function CreateVillage() public onlyOwner{
        Village NewTown = new Village();
        Villages.push(NewTown);
    }
}