pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "./Counters.sol"; 
import "./Ownable.sol";


contract RequestCity is Ownable, ERC721 {
    
    using Counters for Counters.Counter;
    
    uint public requestPrice = 0.01 ether;
    
    Counters.Counter private tokenID;
    uint tokenReward; 
    
    ERC20 public ERC20Interface;
    address payable contractERC20;
    
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
    event StateUpdate();
    
    ///FUNCTIONS
    
      ///https://medium.com/@jeancvllr/solidity-tutorial-all-about-enums-684adcc0b38e
    ///https://github.com/cristiam86/chain-manager/blob/master/contracts/ChainManager.sol
    
    /// @author Jordi Guirao
    /// @notice create a new Request
    /// @param _ipfsHash
    /// @param _city
    /// @param _requestAddress
    /// @param _description
    /// @param _priority rfgr
    function createRequest(string memory _ipfsHash, string memory _city, string memory _requestAddress, string memory _description, Priority _priority) public payable  {
        require(msg.value >= requestPrice, "You need to pay more ether to create a request");
        
        uint ID = tokenID.current();
        _mint(msg.sender, ID);
        Request memory request = Request(ID, now, _ipfsHash, msg.sender, _city, _requestAddress, _description, _priority, State.requested );
        requests[ID] = request;
        uint[] storage apliRequests = applicantRequests[msg.sender];
        apliRequests.push(ID);
        tokenID.increment();
        
        emit NewRequest(ID, msg.sender, _ipfsHash, _city, _requestAddress);
    }
    
       
     //https://ethereum.stackexchange.com/questions/65899/transfer-erc20-token-from-a-smart-contract
     //https://ethereum.stackexchange.com/questions/74271/how-to-use-dai-in-my-contract
     //https://github.com/makerdao/developerguides/blob/master/dai/dai-in-smart-contracts/README.md#write-your-code
    function changeState(uint _requestID, State _state) public onlyOwner returns {
        require(_state == 1 || _state == 2);
        Request storage request = requests[_requestID];
        request.state = _state; 
        
        if (request.state == 1) {
           ERC20Interface(contractERC20).transfer(request.applicant, tokenReward)
        } else 
        
    
    }
    
     /// @author Jordi Guirao
    /// @notice get request information
    /// @param request ID
    /// @return request details
    function getRequest(uint256 _requestID) external view returns(uint _id, uint _dateOfIssue, string memory _ipfsHash, address _applicant, string memory _city, string memory _requestAddress, string memory _description
    , Priority, State) {
        require(_exists(_requestID), "This request ID doe not exists");
        
        Request storage request = requests[_requestID];
        
        return (request.id, request.dateOfIssue, request.ipfsHash, request.applicant, request.city, request.requestAddress, request.description, request.priority, request.state);
    }
    
    /// @author Jordi Guirao
    /// @notice get the number of requests made
    /// @return number of requests
   // function getNumberOfRequests() external view returns (uint){
       // return balanceOf(msg.sender);
   // }
    
    /// @author Jordi Guirao
    /// @notice get all the request that a user has made. 
    /// @return an array with the id of the requests that msg.sender has done. 
    function getTeamPlayersIds() external view returns (uint[] memory){
        require(balanceOf(msg.sender) > 0, "msg.sender has not made any request");
        return applicantRequests[msg.sender];
    } 
    
    
    /// @author Jordi Guirao
    /// @notice change the requestPrice
    /// @param new request price in wei
    /// @return Price of the request
    function setRequestPrice (uint _newprice) public onlyOwner returns (uint) {
        requestPrice = _newprice * 1 ether;
        return requestPrice;
    }
    
     /// @author Jordi Guirao
    /// @notice change the token address
    /// @param new token address
    /// @return new address
    function setTokenAddress (uint _newAddress) public onlyOwner returns (address) {
        contractERC20 = _newAddress;
        return contractERC20;
    }
    
    /// @author Jordi Guirao
    /// @notice obtain the balance of the contract address
    /// @return contract's balance
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