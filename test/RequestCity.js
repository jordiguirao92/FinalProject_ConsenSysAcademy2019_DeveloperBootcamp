Web3 = require('web3');

const RequestCity = artifacts.require('RequestCity');
let catchRevert = require("./exceptionHelpers.js").catchRevert;



contract ('RequestCity', function(accounts){

    let requestCity; 
    let weiRequestPrice = Web3.utils.toWei('0.01', 'ether');
    const request1 = {
        ipfsHash: "abcdefg", 
        city: "Barcelona",
        address: "Major Street 60",
        description: "shabby container",
        priority: 0
    }
    const request2 = {
        ipfsHash: "abcd35453efg", 
        city: "Madrid",
        address: "Major Street 89",
        description: "fallen tree",
        priority: 1
    }

    beforeEach(async () => {
        requestCity = await RequestCity.new();
    });

    it("The deploying address has to be set to true in the mapping ownerlist ", async() => {
        const owner = await requestCity.ownerslist.call(accounts[0]);
        assert.equal(owner, true, "the deploying address should be the owner");
    })

    it('addOnwer: add an address to the ownerslist from the sc owner address', async () => {
        await requestCity.addOwner(accounts[1], { from: accounts[0] });
        const addrAdded = await requestCity.ownerslist.call(accounts[1]);
        assert.equal(addrAdded, true, "The account is not in the ownerlist");
      });

    it('removeOwner: remove an address to the ownerslist from one ownerlist address', async () => {
        await requestCity.addOwner(accounts[1], { from: accounts[0] });
        const addrAdded = await requestCity.ownerslist.call(accounts[1]);
        assert.equal(addrAdded, true, "The account is not in the ownerlist");
        
        await requestCity.removeOwner(accounts[1], { from: accounts[0] });
        const addrRemoved = await requestCity.ownerslist.call(accounts[1]);
        assert.equal(addrRemoved, false, "The account is an owner account");

        await catchRevert(requestCity.addOwner(accounts[2], { from: accounts[1] }));
      });

    it('AddOwner and check some onlyOwner functions', async () => {
        await requestCity.addOwner(accounts[1], { from: accounts[0] });
        const addrAdded = await requestCity.ownerslist.call(accounts[1]);
        assert.equal(addrAdded, true, "The account is not in the ownerlist");   
        
        await requestCity.addOwner(accounts[2], { from: accounts[1] });
        const addrAdded2 = await requestCity.ownerslist.call(accounts[2]);
        assert.equal(addrAdded2, true, "The account is not in the ownerlist");
        
        await requestCity.removeOwner(accounts[2], { from: accounts[1] });
        const addrRemoved = await requestCity.ownerslist.call(accounts[2]);
        assert.equal(addrRemoved, false, "The account is an owner account");
    });

    it('ERC20 mintToken: Create `mintedAmount` tokens and send it to `target`', async () => {
        await requestCity.mintToken(accounts[1], 20, { from: accounts[0] });
        const balanceMint = await requestCity.balanceOfToken.call(accounts[1]);
        assert.equal(balanceMint, 20, "The balance is not equal to the mint token amount");

        const totalSupply = await requestCity.totalSupply.call(); 
        assert.equal(totalSupply, 21, "Total supply is not correct");
      });

      it('create a request and get the information of the request using the id', async () => {
        await requestCity.createRequest(request1.ipfsHash, request1.city, request1.address, request1.description, request1.priority, { from: accounts[1], value: weiRequestPrice });
        const requestIDdata0 = await requestCity.requests.call(0);
        assert.equal(requestIDdata0[0], 0, "The request ID should be 0");
        assert.equal(requestIDdata0[2], request1.ipfsHash, "The request ipfs should match"); 
        assert.equal(requestIDdata0[3], accounts[1], "The applicant address should match");
        assert.equal(requestIDdata0[4], request1.city , "The city should match"); 
        assert.equal(requestIDdata0[5], request1.address , "The address should match"); 
        assert.equal(requestIDdata0[6], request1.description , "The description should match");
        assert.equal(requestIDdata0[7], request1.priority , "The priority should match");
        assert.equal(requestIDdata0[8], 0, "The state should match");

        await requestCity.createRequest(request2.ipfsHash, request2.city, request2.address, request2.description, request2.priority, { from: accounts[2], value: weiRequestPrice });
        const requestIDdata1 = await requestCity.getRequest(1);
        assert.equal(requestIDdata1[0], 1, "The request ID should be 1");
        assert.equal(requestIDdata1[2], request2.ipfsHash, "The request ipfs should match"); 
        assert.equal(requestIDdata1[3], accounts[2], "The applicant address should match");
        assert.equal(requestIDdata1[4], request2.city , "The city should match"); 
        assert.equal(requestIDdata1[5], request2.address , "The address should match"); 
        assert.equal(requestIDdata1[6], request2.description , "The description should match");
        assert.equal(requestIDdata1[7], request2.priority , "The priority should match");
        assert.equal(requestIDdata1[8], 0 , "The state should match");

        const balanceAccount1 = await requestCity.getNumberOfRequests( {from: accounts[1] });
        assert.equal(balanceAccount1, 1 , "The balance has to be 1");

        const balanceAccount3 = await requestCity.getNumberOfRequests( {from: accounts[3] });
        assert.equal(balanceAccount3, 0 , "The balance has to be 0");
      });

      it('Only owners can solve a request. Check solveRequest function. The user has to receive the token reward ', async () => {
        await requestCity.createRequest(request1.ipfsHash, request1.city, request1.address, request1.description, request1.priority, { from: accounts[1], value: weiRequestPrice });
        await catchRevert(requestCity.solveRequest(0, {from: accounts[1]}));
        
        await requestCity.solveRequest(0, {from: accounts[0]});
        const balacenToken = await requestCity.balanceOfToken.call(accounts[1])
        assert.equal(balacenToken, 10, "The balance is not equal to the token reward");

        const requestIDdata0 = await requestCity.requests.call(0);
        assert.equal(requestIDdata0[8], 1 , "The state should match");
      });

});