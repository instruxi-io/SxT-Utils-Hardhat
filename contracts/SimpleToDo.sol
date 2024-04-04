// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SimpleToDo {
    mapping (address => uint) task;

    event CreatedTask(address indexed sender, uint256 indexed task);

    function addTask() public {
        task[msg.sender] += 1;
        emit CreatedTask(msg.sender, task[msg.sender]); 
    }
}