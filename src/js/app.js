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
        $.getJSON('RequestCity.json'), function(data) {
            var RequestCityArtifact = data;
            // Instantiate a new truffle contract from the artifact
            App.contracts.RequestCity = TruffleContract(RequestCityArtifact);
            // Connect provider to interact with contract
            App.contracts.RequestCity.setProvider(App.web3Provider);
        }
        return this.getActiveAccount();
    },

     getActiveAccount: async function() {
        let account = await web3.eth.accounts;
        $("#ethaddress").html("Your Account: " + account);
        return this.loadInformation();
    },

    loadInformation: async function() {
      try {
        //truffle-contract: .deployed(), truffle framework will know where is the contract.
        let instance = await App.contracts.RequestCity.deployed();
        let account = await web3.eth.accounts;
        const balanceToken = await instance.balanceOfToken.call(accounts)
      } catch (err) {
        console.log("Error =>", err);
      }  
    },

    createRequest: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        await instance.createRequest($("#ipfs").val(), $("#city").val(), $("#requestAddress").val(), 
        $("#description").val(), parseInt($( "input:checked" ).val()));
      } catch(err) {
        console.log("Error =>", err);
      }  
    },

    getUserRequests: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        let userRequests = await instance.getUserRequests();
        $("#userRequests").html(userRequests);
      } catch(err) {
        console.log("Error =>", err);
      }
    },
    
    checkRequest: async function() {
      try {
        let instance = await App.contracts.RequestCity.deployed();
        let requestID = parseInt($("#requestId").val());
        let requestDetails = await instance.getRequest(requestID);
        let userRequests = await instance.getUserRequests();
        let numberRequests = await instance.getNumberOfRequests();
        let cytToken = await instance.balanceOfToken.call(requestDetails[3]);

        $("#idid").html("Request ID:" + requestDetails[0]);
        $("#dateid").html("Date of Issue:" + requestDetails[1]);
        $("#ipfsid").html("IPFS Hash:" + requestDetails[2]);
        $("#applicantid").html("Applicant" + requestDetails[3]);
        $("#cityid").html("City" + requestDetails[4]);
        $("#addressid").html("Address:" + requestDetails[5]);
        $("#descriptionid").html("Description:" + requestDetails[6]);
        $("#priorityid").html("Priority:" + requestDetails[7]);
        $("#stateid").html("State:" + requestDetails[8]);
        $("#applicantRequests").html("Number of requests:" + numberRequests);
        $("#citizenRequests").html("Citizen requests:" + userRequests);
        $("#cytBalance").html("Balance of CYT:" + cytToken);

      } catch (err) {
        console.log("Error =>", err);
      }
    } 

}


  $(function() {
  $(window).load(function() {
    App.initWeb3();
    //$('.div-block-3').hide();
  });
});

$(document).ready(function(){
    $('.check').click(function() {
        $('.check').not(this).prop('checked', false);
    });
});

//setInterval(() => {App.getActiveAccount()}, 1000);