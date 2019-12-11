# RequestCity.sol & ERC20CYT.sol Design patterns:

  * Restricting Acces: The ERC20 "constructor" is declared as internal. Also "_transfer" function is declared as internal. Only the smart contract are permitted to execute this function. The modifier "onlyOwner" restricts the access to admin functions to the contracts owners. Creating the smart contract Ownable.sol we can manage smart contracts owners, it allows to have several owners. 
  * Pull over Push Payment (Withdrawal): The function "withdrawBalance" allows to the smart contract owners (using the modifier "onlyOwner") to transfer the balance of the smart contract. 


