pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "./ERC20CYT.sol";
import "../node_modules/openzeppelin-solidity/contracts/drafts/Counters.sol";

/// @title A dapp for create reques
/// @author Jordi Guirao
/// @notice Dapp to create requests to a city council, for example. If the requests are solved, the user will earn token
contract RequestCity is ERC721, ERC20CYT(1) {
    
    using Counters for Counters.Counter;
    
    uint public requestPrice = 0.01 ether;
    
    Counters.Counter private tokenID;
    
    uint tokenReward = 10;
   
    struct Request {
        uint id;
        uint dateOfIssue;
        string ipfsHash;
        address payable applicant;
        string city;
        string requestAddress;
        string description;
        Priority priority;
        State state;
    }
    
    enum Priority {high, medium, low}
    enum State {requested, solved, denied}
    
    mapping(uint256 => Request) public requests;
    mapping(address => uint[]) public applicantRequests;
    
    event NewRequest(uint requestID, address applicant, string ipfsHash, string city, string requestAddress);
    event AccidentalDeposit(address sender, uint value);
    event WithdrawEvent(address owner, uint value);
    event StateUpdate(uint requestID, State state);
    
    /// @author Jordi Guirao
    /// @notice create a new Request
    /// @param _ipfsHash ipsfhash of the image
    /// @param _city Nambe of the city
    /// @param _requestAddress Address where is the event found
    /// @param _description Description of the request
    /// @param _priority Priority that need the request to be solved
    function createRequest(string memory _ipfsHash, string memory _city, string memory _requestAddress, string memory _description,
    Priority _priority) public payable {
        require(msg.value >= requestPrice, "You need to pay more ether to create a request");
        uint ID = tokenID.current();
        _mint(msg.sender, ID);
        Request memory request = Request(ID, now, _ipfsHash, msg.sender, _city, _requestAddress, _description, _priority, State.requested);
        requests[ID] = request;
        uint[] storage apliRequests = applicantRequests[msg.sender];
        apliRequests.push(ID);
        tokenID.increment();
        emit NewRequest(ID, msg.sender, _ipfsHash, _city, _requestAddress);
    }

    /// @author Jordi Guirao
    /// @notice get request information
    /// @param _requestID ID of the request
    /// @return request details
    function getRequest(uint256 _requestID) external view returns(uint _id, uint _dateOfIssue, string memory _ipfsHash, address _applicant, string memory _city, string memory _requestAddress, string memory _description
    , Priority, State) {
        require(_exists(_requestID), "This request ID doe not exists");
        Request storage request = requests[_requestID];
        return (request.id, request.dateOfIssue, request.ipfsHash, request.applicant, request.city, request.requestAddress, request.description, request.priority, request.state);
    }
    
    /// @author Jordi Guirao
    /// @notice get all the request that a user has made.
    /// @return an array with the id of the requests that msg.sender has done.
    function getUserRequests() external view returns (uint[] memory){
        require(balanceOf(msg.sender) > 0, "msg.sender has not made any request");
        return applicantRequests[msg.sender];
    }

    /// @author Jordi Guirao
    /// @notice get the number of requests made by msg.sender
    /// @return number of requests
    function getNumberOfRequests() external view returns (uint){
        return balanceOf(msg.sender);
    }

    /// @author Jordi Guirao
    /// @notice change the request state to solve denied. Only onlyOwners can do it
    /// @param _requestID id of the request
    /// @return new request state
    function denyRequest(uint _requestID) public onlyOwner returns (State) {
        require(requests[_requestID].state == State.requested, "The request state is not'requested'");
        Request storage request = requests[_requestID];
        request.state = State.denied;
        emit StateUpdate(_requestID, request.state);
        return request.state;
    }

    /// @author Jordi Guirao
    /// @notice change the request state to solved. Only onlyOwners can do it
    /// @param _requestID id of the request
    /// @return new request state
     function solveRequest(uint _requestID) public onlyOwner returns (State) {
        require(requests[_requestID].state == State.requested, "The request state is not'requested'");
        Request storage request = requests[_requestID];
        request.state = State.solved;
        //ERC20Interface(contractERC20).transfer(request.applicant, tokenReward);
        mintToken(request.applicant, tokenReward);
        emit StateUpdate(_requestID, request.state);
        return request.state;
    }

    
    /// @author Jordi Guirao
    /// @notice change the requestPrice
    /// @param _newprice new request price in wei
    /// @return Updated price of the request
    function setRequestPrice (uint _newprice) public onlyOwner returns (uint) {
        requestPrice = _newprice * 1 ether;
        return requestPrice;
    }

    /// @author Jordi Guirao
    /// @notice change the tokenReward
    /// @param _newTokenReward new request price in wei
    /// @return Updated price of the request
    function setTokenReward (uint _newTokenReward) public onlyOwner returns (uint) {
        tokenReward = _newTokenReward;
        return tokenReward;
    }
    
    /// @author Jordi Guirao
    /// @notice obtain the balance of the contract address
    /// @return contracts balance
    function contractBalance() external view onlyOwner returns(uint) {
        return address(this).balance;
    }

    /// @author Jordi Guirao
    /// @notice owner can withdraw the contract balance
    function withdrawBalance() external onlyOwner {
        address payable owner = msg.sender;
        owner.transfer(address(this).balance);
        emit WithdrawEvent(owner, address(this).balance);
    }
    
     ///@author Jordi Guirao
     ///@dev Fallback function allows to deposit ether.
    function() external payable {
        if (msg.value > 0) {
            emit AccidentalDeposit(msg.sender, msg.value);
	    }
    }
}