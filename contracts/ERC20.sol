pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Ownable.sol";



contract ERC20 is Ownable {

    string public constant name = "CityToken";
    string public constant symbol = "CYT";
    uint8 public constant decimals = 18;


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;

    using SafeMath for uint256;


   constructor(uint256 total) public {
	totalSupply_ = total;
	balances[msg.sender] = totalSupply_;
    }  

    function totalSupplyToken() public view returns (uint256) {
	return totalSupply_;
    }
    
    function balanceOfToken(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transferToken(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender], "Not sufficient balance token");
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approveToken(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowanceToken(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFromToken(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner], "Not sufficient token");
        require(numTokens <= allowed[owner][msg.sender], "Number of token is high than allowed token");
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    /// @notice Create `mintedAmount` tokens and send it to `target`
     /// @param target Address to receive the tokens
     /// @param mintedAmount the amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balances[target] += mintedAmount;
        totalSupply_ += mintedAmount;
        emit Transfer(address(0), address(this), mintedAmount);
        emit Transfer(address(this), target, mintedAmount);
    }

}