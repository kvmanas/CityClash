pragma solidity ^0.5.0;
import "./Ownable.sol";
contract Village is Ownable{
    struct UserModel{
        uint Gold;
        uint Elixr;
    }
    UserModel public UserDetails;

    constructor() public{
        UserDetails.Gold = 1;
        UserDetails.Elixr = 1;
    }
    function DestroyVillage() external onlyOwner{
        selfdestruct(owner());
    }

}