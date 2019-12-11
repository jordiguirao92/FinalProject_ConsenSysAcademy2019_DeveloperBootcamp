# Avoiding common attacks:

  * TxOrigin Attack: The smart contract is using msg.sender instead of tx.origin for authorization to avoid attacks.
  * Integer Over/Underflow: Using the SafeMath library the smart contract avoid these attacks. 
  * To avoid not admin atacks I have used "onlyOwner" modifier in admin functions. 
  * Security Analysis Tools: During the development I have used security anaylisis tools in order to aboid security vulnerabilities. 
