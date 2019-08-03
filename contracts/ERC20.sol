pragma solidity ^0.5.0;
import "./SafeMath.sol";
contract CityGem{
    using SafeMath for uint256;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
	address payable public owner;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
	mapping (address => uint256) public freezeOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* This notifies clients about the amount burnt */
    event Burn(address indexed from, uint256 value);
	
	/* This notifies clients about the amount frozen */
    event Freeze(address indexed from, uint256 value);
	
	/* This notifies clients about the amount unfrozen */
    event Unfreeze(address indexed from, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol,
        address payable _owner
        ) public {
        balanceOf[_owner] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
		owner = _owner;                                     // Contract owner address
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_to != address(0),"Use burn() instead");                           // Prevent transfer to 0x0 address. Use burn() instead
		require(_value > 0, "Value must be greater than zero");
        require(balanceOf[msg.sender] >= _value,"insufficient funds");           // Check if the sender has enough
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);                     // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                            // Add the same to the recipient
        emit Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
        return true;
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
		require(_value > 0,"Value must be greater than zero");
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0),"Use burn() instead");                                // Prevent transfer to 0x0 address. Use burn() instead
		require(_value > 0, "Value must be greater than zero");
        require(balanceOf[_from] >= _value,"insufficient funds");                 // Check if the sender has enough
        require(_value >= allowance[_from][msg.sender],"Transfer not allowed from this contract");     // Check allowance
        balanceOf[_from] = balanceOf[_from].sub(_value);                           // Subtract from the sender
        balanceOf[_to] = balanceOf[_to].add(_value);                             // Add the same to the recipient
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value,"insufficient funds");            // Check if the sender has enough
		require(_value > 0,"Value must be greater than zero");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);                      // Subtract from the sender
        totalSupply = totalSupply.sub(_value);                                // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }
	
	function freeze(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value,"insufficient funds");            // Check if the sender has enough
		require(_value > 0,"Value must be greater than zero");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);                      // Subtract from the sender
        freezeOf[msg.sender] = freezeOf[msg.sender].sub(_value);                                // Updates totalSupply
        emit Freeze(msg.sender, _value);
        return true;
    }
	
	function unfreeze(uint256 _value) public returns (bool success) {
        require(freezeOf[msg.sender] >= _value,"insufficient funds");            // Check if the sender has enough
		require(_value > 0,"Value must be greater than zero");
        freezeOf[msg.sender] = freezeOf[msg.sender].sub(_value);                      // Subtract from the sender
		balanceOf[msg.sender] = balanceOf[msg.sender].add(_value);
        emit Unfreeze(msg.sender, _value);
        return true;
    }
	
	// transfer balance to owner
	function withdrawEther(uint256 amount) public {
		require(msg.sender == owner,"Not owner");
		owner.transfer(amount);
	}
	
	// can accept ether
	function() external payable {
    }
}