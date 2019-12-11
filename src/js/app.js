
App = {
    web3Provider: null,
    contracts: {},

    initWeb3: async function() {
      // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
          console.log("Account access OK");
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(App.web3Provider);

      return this.initContract();
    },
    
    initContract: function() {
        $.getJSON('RequestCity.json', function(data) {
            console.log(data);
            var RequestCityArtifact = data;
            console.log("data ok");
            // Instantiate a new truffle contract from the artifact
            App.contracts.RequestCity = TruffleContract(RequestCityArtifact);
            console.log("trufflecontract ok");
            // Connect provider to interact with contract
            App.contracts.RequestCity.setProvider(App.web3Provider);
            console.log("setprovider ok");
            return App.getActiveAccount();
        });   
    },

     getActiveAccount: async function() {
        let account = await web3.eth.accounts;
        console.log("Active account" + account);
        $("#ethaddress").html("Your Account: " + account);
        return this.loadInformation();
    },

    loadInformation: async function() {
      try {
        //truffle-contract: .deployed(), truffle framework will know where is the contract.
        let instance = await App.contracts.RequestCity.deployed();
        let account = await web3.eth.accounts;
        console.log(account);
        const balanceToken = await instance.balanceOfToken.call(account)
        console.log("Balance of token: " + balanceToken.toNumber());
      } catch (err) {
        console.log("Error =>", err);
      }  
    },

    createRequest: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        let account = (await web3.eth.accounts).toString();
        let weiRequestPrice = web3.toWei('0.01', 'ether');
        console.log(weiRequestPrice);
        console.log(instance);
        console.log(account);
        await instance.createRequest($("#ipfsHash").text(), $("#city").val(), $("#requestAddress").val(), 
        $("#description").val(), parseInt($( "input:checked" ).val()), {from: account, value: weiRequestPrice });
        console.log("Request Created");
      } catch(err) {
        console.log("Error =>", err);
      }  
    },

    getUserRequests: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        let account = (await web3.eth.accounts).toString();
        let userRequests = await instance.getUserRequests( {from: account});
        console.log(userRequests);
        $("#userRequests").text(userRequests);
      } catch(err) {
        console.log("Error =>", err);
      }
    },
    
    checkRequest: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        let account = (await web3.eth.accounts).toString();
        let requestID = parseInt($("#requestId").val());
        let requestDetails = await instance.getRequest(requestID, {from: account});
        let userRequests = await instance.getUserRequests({from: requestDetails[3]});
        let numberRequests = await instance.getNumberOfRequests({from: requestDetails[3]});
        let cytToken = await instance.balanceOfToken.call(requestDetails[3]);
        
        $('.div-block-3').show();
        
        var test = new Date(requestDetails[1]*1000);
        var priorityState;
        switch (parseInt(requestDetails[7].c)) {
          case 0:
            priorityState = "High";
            break;
          case 1:
            priorityState = "Medium";
            break; 
          case 2:
            priorityState = "Low";
            break;   
        }
      
        var stateValue;
        switch (parseInt(requestDetails[8].c)) {
          case 0:
              stateValue = "Requested";
            break;
          case 1:
              stateValue = "Solved";
            break; 
          case 2:
              stateValue = "Denied";
            break;   
        }

        $("#idid").html("Request ID: " + requestDetails[0]);
        $("#dateid").html("Date of Issue: " + requestDetails[1] + " " + test.toUTCString());
        $("#ipfsid").html("IPFS Hash: " + requestDetails[2]);
        $("#applicantid").html("Applicant: " + requestDetails[3]);
        $("#cityid").html("City: " + requestDetails[4]);
        $("#addressid").html("Address: " + requestDetails[5]);
        $("#descriptionid").html("Description: " + requestDetails[6]);
        $("#priorityid").html("Priority: " + priorityState);
        $("#stateid").html("State: " + stateValue);
        $("#applicantRequests").html("Number of requests: " + numberRequests);
        $("#citizenRequests").html("Citizen requests: " + userRequests);
        $("#cytBalance").html("Balance of CYT: " + cytToken);

        AppIpfs.getFile(requestDetails[2]);

      } catch (err) {
        console.log("Error =>", err);
      }
    },
    
    solveRequest: async function() {
      try{
        let instance = await App.contracts.RequestCity.deployed();
        let requestID = parseInt($("#requestId").val());
        let account = (await web3.eth.accounts).toString();
        let requestSolve = await instance.solveRequest(requestID, {from: account});
        console.log(requestSolve);
        alert("The request" +" "+ requestID +" "+ "is solved");
        this.checkRequest();

      } catch (err) {
        console.log("Error =>", err);
      }
    }, 

    denyRequest: async function() {
      try{
        let instance = await App.contracts.RequestCity.deployed();
        let account = (await web3.eth.accounts).toString();
        let requestID = parseInt($("#requestId").val());
        let requestDeny = await instance.denyRequest(requestID, {from: account});
        console.log(requestDeny);
        alert("The request" +" "+ requestID +" "+ "is denied");
        this.checkRequest();

      }catch (err){
        console.log("Error =>", err);
      }
    }

}


  $(function() {
  $(window).load(function() {
    App.initWeb3();
    $('.div-block-3').hide();
  });
});

$(document).ready(function(){
    $('.check').click(function() {
        $('.check').not(this).prop('checked', false);
    });
});

//setInterval(() => {App.getActiveAccount()}, 1000);