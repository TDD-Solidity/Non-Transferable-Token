// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NonTransferableToken is ERC721 {

    uint public next_token_id;

    constructor() ERC721("NonTransferableToken", "NTT") {}

    function hello() public pure returns (string memory) {
        return "hello";
    }

    function mint() public {
        _mint(msg.sender, next_token_id);
        next_token_id++;
    }

    function _transfer(
        address from,
        address to,
        uint tokenId
    ) internal pure override {
        revert('Cannot transfer a non-transferable token!');
    }

}
