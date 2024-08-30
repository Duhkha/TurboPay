// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TurboPay {
    // Mapping from address to balance (how much money each address has)
    mapping(address => uint256) public balances;

    // Event that is emitted after a transaction is completed
    event Transfer(address indexed from, address indexed to, uint256 amount);

    // Event for withdrawals
    event Withdrawal(address indexed to, uint256 amount);

    // Function to deposit money into the wallet (callable by anyone)
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        balances[msg.sender] += msg.value;
        emit Transfer(address(0), msg.sender, msg.value);
    }

    // Function to send money to another user
    function sendMoney(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance.");
        require(_to != address(0), "Cannot transfer to the zero address.");

        // Transfer the amount
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
    }

    // Function to withdraw money back to their wallet
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance to withdraw.");
        
        // Reduce the balance first to prevent re-entrancy attacks
        balances[msg.sender] -= _amount;
        
        // Transfer the amount back to the user's wallet
        payable(msg.sender).transfer(_amount);

        emit Withdrawal(msg.sender, _amount);
    }

    // Function to get the balance of an address
    function getBalance(address _addr) public view returns (uint256) {
        return balances[_addr];
    }
}
