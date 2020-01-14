# ConsenSys Academy’s 2019 Developer Bootcamp Final Project - CITYBetter

## What is CITYBetter? 
CITYBetter is a dApp where citizens can create a request to improve the city environment. For example, you can create a request to ask the city council to fix a traffic light. Another example, you have seen a tree disrepair then you request to the city council that provides a solution. The city council will manage your request. If it considers that your request is needed and important, the council will resolve it. After that, you will receive the CYT (City Token) reward. The citizen can spend these tokens in supermarkets, pharmacies, fuel stations, etc of the city...

## Set up

1. Clone or download the project.
2. Go to the project root folder and install dependencies using `npm install`.
3. Start Ganache and copy the "mnemonic" words. 
4. Go to the "truffle-config.js" file and paste the "mnemonic" words in the `const mnemonic = "paste here"`.
5. Import the first Ganache account to your Metamask. Important: You will need some ether in that account. You cant get it in the Rinkeby Faucet https://faucet.rinkeby.io/.
6. Test the smart contract: In order to test the contract go to the root folder of the project and execute `truffle test`. Check that the 7 tests pass successful. 
7. In the root folder of the project execute `truffle migrate --network rinkeby`. Remember: If the contract has been migrated you will need to execute `truffle migrate  --reset --network rinkeby`. In order to deploy contracts in a local network you can use `truffle migrate --network development`.
8. Go to the root folder of the project and execute `npm run dev`.
9. Start to interact with CITYBetter.


## How can I create a request?
In order to create a request you have to provide some information:
* City: You have to write the name of the city
* Address: Write the address where you find the incidence
* Description: Provide a description of the request that you want to make. 
* Priority: Select the between 3 priorities, high, medium and low. 
* Incidence image to IPFS: You have to upload an image of the incidence. This image will be upload to the IPFS system. After that, you can find below the IPFS hash of the image.
* Currently the price of the request is 0.01 ETH. Only the owners can change this price. 

## How cant I get my requests? 
You can get all your requests IDs clicking the button "Click me!". It will provide the ID of the requests that you have created. 

## How can I check my request?
In order to check your request details, write your request ID inside the "Request ID" input, after that click the button "Check details". After that your can find all the information about the request. This information comes from the smart contract. You cand find the state of your request, the balance of token that have the person who has create this request, you can check the IPFS image that the request creator uploaded...

## Can I solve or deny a request?
Only the owners/admin team can deny or solve a request. If the request is solved, the requests creator will receive CYT. In case the request is denied the request creator will not receive CYT. 









