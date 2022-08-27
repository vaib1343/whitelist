//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Whitelist {
    uint8 public maxWhitelistAddresses;

    mapping(address => bool) public whiteListedAddresses;

    uint8 public numAddressWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist () public {
        require(!whiteListedAddresses[msg.sender],"Sender has already been whitelisted");

        require(numAddressWhitelisted < maxWhitelistAddresses, "More addresses cant be added, limit reached");

        whiteListedAddresses[msg.sender] = true;
        numAddressWhitelisted += 1;
    }
}