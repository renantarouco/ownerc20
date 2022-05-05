// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error OwnERC20__SenderOrReceiverIsNotTheOwner();
error OwnERC20__GiverOrDeductorIsNotTheOwner();
error OwnERC20__AddressNotRegistered();

contract OwnERC20 is ERC20 {
    address private immutable i_owner;
    mapping(address => bool) registeredAddresses;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert OwnERC20__GiverOrDeductorIsNotTheOwner();
        }

        _;
    }

    modifier mustBeRegistered(address target) {
        bool isRegistered = registeredAddresses[target];
        if (!isRegistered) {
            revert OwnERC20__AddressNotRegistered();
        }

        _;
    }

    constructor(uint256 initialSupply) ERC20("Own Token", "OWN") {
        i_owner = msg.sender;

        _mint(msg.sender, initialSupply * 10**decimals());
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        bool canTransfer = msg.sender == i_owner || to == i_owner;
        if (!canTransfer) {
            revert OwnERC20__SenderOrReceiverIsNotTheOwner();
        }

        return super.transfer(to, amount);
    }

    function registerAddress(address target) external {
        registeredAddresses[target] = true;
    }

    function unregisterAddress(address target)
        external
        mustBeRegistered(target)
    {
        delete registeredAddresses[target];
    }

    function isAddressRegistered(address target)
        external
        view
        onlyOwner
        returns (bool)
    {
        return registeredAddresses[target];
    }

    function give(address to, uint256 amount)
        external
        onlyOwner
        mustBeRegistered(to)
    {
        _mint(to, amount);
    }

    function deduct(address from, uint256 amount)
        external
        onlyOwner
        mustBeRegistered(from)
    {
        _burn(from, amount);
    }
}
