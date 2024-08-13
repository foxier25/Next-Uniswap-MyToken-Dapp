// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Uniswap {
    string public name = 'Uniswap';
    string public symbol = 'UniswapDAPP';

    uint256 public transactionCount = 0;
    mapping(uint256 => Transaction) internal transactions;

    struct Transaction {
        uint256 id;
        address sender;
        address receiver;
        uint256 txAmount;
        bytes32 txHash;
        uint256 timeStamp;
    }

    event SendEth(address sender, address receiver, uint256 transferAmount);
    event SaveTransaction(
        uint256 _id,
        address _sender,
        address _receiver,
        uint256 _txAmount,
        bytes32 _txHash
    );

    function sendEth(address _receiver) public payable {
        require(msg.sender != address(0));
        require(msg.value > 0, 'Please send value greater than 0');

        payable(_receiver).transfer(msg.value);
        transactions[transactionCount] = Transaction(
            transactionCount,
            msg.sender,
            _receiver,
            msg.value,
            blockhash(block.number),
            block.timestamp
        );

        emit SendEth(msg.sender, _receiver, msg.value);
        emit SaveTransaction(
            transactionCount,
            msg.sender,
            _receiver,
            msg.value,
            blockhash(block.number)
        );
        transactionCount++;
    }

    function getTransfers() external view returns (Transaction[] memory) {
        require(msg.sender != address(0));

        uint256 currentIndex = 0;
        uint256 currentIndex2 = 0;

        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].sender == msg.sender) {
                currentIndex++;
            }
        }

        Transaction[] memory _transactions = new Transaction[](currentIndex);
        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].sender == msg.sender) {
                _transactions[currentIndex2] = transactions[i];
                currentIndex2++;
            }
        }

        return _transactions;
    }

    function getReceivers() external view returns (Transaction[] memory) {
        require(msg.sender != address(0));

        uint256 currentIndex = 0;
        uint256 currentIndex2 = 0;

        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].receiver == msg.sender) {
                currentIndex++;
            }
        }

        Transaction[] memory _transactions = new Transaction[](currentIndex);
        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].receiver == msg.sender) {
                _transactions[currentIndex2] = transactions[i];
                currentIndex2++;
            }
        }

        return _transactions;
    }
}
