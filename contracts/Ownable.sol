pragma solidity ^0.5.0;

contract Ownable {

    mapping(address => bool) public ownerslist;

    constructor() public {
        ownerslist[msg.sender] = true;
    }

    event OwnerslistAddressAdded(address addr);
    event OwnerslistAddressRemoved(address addr);


    modifier onlyOwner() {
        require(ownerslist[msg.sender]);
        _;
    }

    ///@author Jordi Guirao
    ///@notice add an address to the ownerslist
    ///@param addr address
    ///@return true if the address was added to the ownerslist, false if the address was already in the ownerslist
    function addOwner(address addr) onlyOwner public returns(bool success){
        if (!ownerslist[addr]) {
            ownerslist[addr] = true;
            emit OwnerslistAddressAdded(addr);
            success = true;
        }
    }

    ///@author Jordi Guirao
    ///@notice remove an address from the ownerslist
    ///@param addr address
    ///@return true if the address was removed from the ownerslist, false if the address wasn't in the ownerslist in the first place
    function removeOwner(address addr) onlyOwner public returns(bool success){
        if (ownerslist[addr]) {
            ownerslist[addr] = false;
            emit OwnerslistAddressRemoved(addr);
            success = true;
        }
    }
  
  
}