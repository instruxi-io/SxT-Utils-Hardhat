// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SimpleToDo {
    mapping (address => uint) task;
    address public owner;

    event CreatedTask(address indexed sender, uint256 indexed task);
    
    constructor(address _owner) {
        owner = _owner;
    }
    function addTask() public {
        task[msg.sender] += 1;
        emit CreatedTask(msg.sender, task[msg.sender]); 
    }
}