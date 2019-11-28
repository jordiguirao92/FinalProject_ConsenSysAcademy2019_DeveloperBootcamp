pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Ownable.sol";

/// @title ERC20 token. It is the reward for resolved requests
/// @author Jordi Guirao
/// @notice This ERC20 token it is the reward for resolved requests
contract ERC20CYT is Ownable {

    using SafeMath for uint256;

    string public name = "CityToken";
    string public symbol = "CYT";
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOfToken;
    mapping (address => mapping (address => uint256)) public allowanceToken;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Burn(address indexed from, uint256 value);

    constructor(uint256 initialSupply) internal {
        totalSupply = initialSupply;
        balanceOfToken[msg.sender] = totalSupply;
    }
    
     /// @author Jordi Guirao
     /// @notice Gets the balance of the specified address.
     /// @param _owner The address to query the the balance of.
     /// @return An uint256 representing the amount owned by the passed address.
    function balanceAddressToken(address _owner) public view returns (uint256 balance) {
    return balanceOfToken[_owner];
    }

     /// @author Jordi Guirao
     /// @notice Function to check the amount of tokens that an owner allowed to a spender.
     /// @param _owner address The address which owns the funds.
     /// @param _spender address The address which will spend the funds.
     /// @return A uint256 specifying the amount of tokens still available for the spender.
    function allowanceAddressToken(address _owner, address _spender) public view returns (uint256) {
    return allowanceToken[_owner][_spender];
    }
     
     /// @author Jordi Guirao
     /// @notice Transfer tokens: Send `_value` tokens to `_to` from your account
     /// @param _to The address of the recipient
     /// @param _value the amount to send
     /// @return bool
    function transferToken(address _to, uint256 _value) public returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != address(0x0), "Prevent transfer to 0x0 address");
        require (balanceOfToken[_from] >= _value, "sender has not enough balance");
        require (balanceOfToken[_to] + _value >= balanceOfToken[_to], "Check for overflows");
        balanceOfToken[_from] -= _value;
        balanceOfToken[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

     /// @author Jordi Guirao
     /// @notice Transfer tokens from other addressSend `_value` tokens to `_to` in behalf of `_from`
     /// @param _from The address of the sender
     /// @param _to The address of the recipient
     /// @param _value the amount to send
     /// @return bool
    function transferFromToken(address _from, address _to, uint256 _value) public returns (bool) {
        require(_value <= allowanceToken[_from][msg.sender], "You are not allowed");
        allowanceToken[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

     /// @author Jordi Guirao
     /// @notice Set allowanceToken for other address: Allows `_spender` to spend no more than `_value` tokens in your behalf
     /// @param _spender The address authorized to spend
     /// @param _value the max amount they can spend
     /// @return bool
    function approveToken(address _spender, uint256 _value) public returns (bool) {
        allowanceToken[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

     /// @author Jordi Guirao
     /// @notice Destroy tokens: Remove `_value` tokens from the system irreversibly
     /// @param _value the amount of money to burn
     /// @return bool
    function burnToken(uint256 _value) public onlyOwner returns (bool) {
        require(balanceOfToken[msg.sender] >= _value, "You do not have sufficient balance");
        balanceOfToken[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        return true;
    }

     /// @author Jordi Guirao
     /// @notice Create `mintedAmount` tokens and send it to `target`
     /// @param target Address to receive the tokens
     /// @param mintedAmount the amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) public onlyOwner {
        balanceOfToken[target] += mintedAmount;
        totalSupply += mintedAmount;
        emit Transfer(address(this), target, mintedAmount);
    }
}