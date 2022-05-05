import { describe } from 'mocha';
import { deployments, ethers, getNamedAccounts, getUnnamedAccounts } from 'hardhat';
import { expect } from 'chai';
import { OwnERC20 } from '../typechain-types';
import { BigNumber } from 'ethers';

describe('Own ERC20', () => {
    let owner: string;
    let contract: OwnERC20;

    beforeEach(async () => {
        await deployments.fixture([ 'OwnERC20' ]);
        const { deployer } = await getNamedAccounts();
        owner = deployer;
        contract = await ethers.getContract('OwnERC20') as OwnERC20;
    });

    it('should deploy with initial supply assigned to the owner', async () => {
        const ownerBalance = await contract.balanceOf(owner);
        const totalSupply = await contract.totalSupply();

        expect(ownerBalance).to.be.equal(totalSupply);
    });

    it('should return zero balance for new wallets', async () => {
        const wallet = ethers.Wallet.createRandom();
        const balance = await contract.balanceOf(wallet.address);

        expect(balance).to.be.equal(0);
    });

    it('should allow the registration of a new address', async () => {
        const [
            _,
            registeredAccount,
            unregisteredAccount
        ] = await getUnnamedAccounts();

        const tx = await contract.registerAddress(registeredAccount);
        await tx.wait();

        const isUnregisteredAccountUnregistered = await contract.isAddressRegistered(
            unregisteredAccount
        );
        const isRegisteredAccountRegistered = await contract.isAddressRegistered(
            registeredAccount
        );

        expect(isUnregisteredAccountUnregistered).to.be.false;
        expect(isRegisteredAccountRegistered).to.be.true;
    });

    it('should allow the unregistration an address', async () => {
        const [ _, account ] = await getUnnamedAccounts();

        const tx1 = await contract.registerAddress(account);
        await tx1.wait();

        const initialRegistrationStatus = await contract.isAddressRegistered(
            account
        );

        const tx2 = await contract.unregisterAddress(account);
        await tx2.wait();

        const finalRegistrationStatus = await contract.isAddressRegistered(
            account
        );

        expect(initialRegistrationStatus).to.be.true;
        expect(finalRegistrationStatus).to.be.false;
    });

    it('should allow transfer from owner to other accounts', async () => {
        const initialOwnerBalance = await contract.balanceOf(owner);
        const totalSupply = await contract.totalSupply();

        const [ _, account ] = await getUnnamedAccounts();
        const transferAmount = BigNumber.from(50);

        const tx = await contract.transfer(account, transferAmount);
        await tx.wait();

        const ownerBalance = await contract.balanceOf(owner);
        const accountBalance = await contract.balanceOf(account);

        expect(initialOwnerBalance).to.be.equal(totalSupply);
        expect(ownerBalance).to.be.equal(initialOwnerBalance.sub(transferAmount));
        expect(accountBalance).to.be.equal(transferAmount);
    });

    it('should allow transfer from other accounts to owner', async () => {
        const [ _, account ] = await ethers.getSigners();
        const initialOwnerBalance = await contract.balanceOf(owner);
        const initialAccountBalance = await contract.balanceOf(account.address);

        const transferAmount = BigNumber.from(50);

        const tx1 = await contract.transfer(account.address, transferAmount);
        await tx1.wait();

        const tx2 = await contract.connect(account).transfer(owner, transferAmount);
        await tx2.wait();

        const ownerBalance = await contract.balanceOf(owner);
        const accountBalance = await contract.balanceOf(account.address);

        expect(ownerBalance).to.be.equal(initialOwnerBalance);
        expect(accountBalance).to.be.equal(initialAccountBalance);
    });

    it('shouldnt allow transfers from accounts other than the owner', async () => {
        const [ _, account1, account2 ] = await ethers.getSigners();
        const transferAmount = BigNumber.from(50);

        const tx1 = await contract.transfer(account1.address, transferAmount);
        await tx1.wait();

        const tx2 = contract.connect(account1).transfer(account2.address, transferAmount);

        await expect(tx2).to.be.revertedWith('OwnERC20__SenderOrReceiverIsNotTheOwner');
    });

    it('shouldnt allow owner to give (mint) to unregistered addresses', async () => {
        const [ _, account ] = await getUnnamedAccounts();

        const tx = contract.give(account, 50);

        await expect(tx).to.be.revertedWith('OwnERC20__AddressNotRegistered');
    });

    it('should allow owner to give (mint) tokens', async () => {
        const initialTotalSupply = await contract.totalSupply();
        const initialOwnerBalance = await contract.balanceOf(owner);

        const [ _, account ] = await getUnnamedAccounts();
        const initialAccountBalance = await contract.balanceOf(account);
        const giveAmount = BigNumber.from(50);
        
        const tx1 = await contract.registerAddress(account);
        await tx1.wait();
        const tx2 = await contract.give(account, giveAmount);
        await tx2.wait();

        const totalSupply = await contract.totalSupply();
        const ownerBalance = await contract.balanceOf(owner);
        const accountBalance = await contract.balanceOf(account);

        expect(totalSupply).to.be.equal(initialTotalSupply.add(giveAmount));
        expect(ownerBalance).to.be.equal(initialOwnerBalance);
        expect(accountBalance).to.be.equal(initialAccountBalance.add(giveAmount));
    });

    it('shouldnt allow accounts to give (mint) tokens to other accounts (including themselves)', async () => {
        const [ _, account1, account2 ] = await ethers.getSigners();
        const giveAmount = BigNumber.from(50);

        const tx1 = contract.connect(account1).give(account2.address, giveAmount);

        await expect(tx1).to.be.revertedWith('OwnERC20__GiverOrDeductorIsNotTheOwner');
        
        const tx2 = contract.connect(account1).give(account1.address, giveAmount);

        await expect(tx2).to.be.revertedWith('OwnERC20__GiverOrDeductorIsNotTheOwner');
    });

    it('shouldnt allow owner to deduct (burn) from unregistered addresses', async () => {
        const [ _, account ] = await getUnnamedAccounts();

        const tx = contract.deduct(account, 50);

        await expect(tx).to.be.revertedWith('OwnERC20__AddressNotRegistered');
    });

    it('should allow owner to deduct (burn) tokens', async () => {
        const [ _, account ] = await getUnnamedAccounts();
        const transferAmount = BigNumber.from(100);

        const tx1 = await contract.registerAddress(account);
        await tx1.wait();

        const tx2 = await contract.transfer(account, transferAmount);
        await tx2.wait();

        const initialTotalSupply = await contract.totalSupply();
        const initialOwnerBalance = await contract.balanceOf(owner);
        const initialAccountBalance = await contract.balanceOf(account);
        const deductAmount = BigNumber.from(50);
        
        const tx3 = await contract.deduct(account, deductAmount);
        await tx3.wait();

        const totalSupply = await contract.totalSupply();
        const ownerBalance = await contract.balanceOf(owner);
        const accountBalance = await contract.balanceOf(account);

        expect(totalSupply).to.be.equal(initialTotalSupply.sub(deductAmount));
        expect(ownerBalance).to.be.equal(initialOwnerBalance);
        expect(accountBalance).to.be.equal(initialAccountBalance.sub(deductAmount));
    });

    it('shouldnt allow accounts to deduct (burn) tokens from other accounts (including themselves)', async () => {
        const [ _, account1, account2 ] = await ethers.getSigners();
        const deductAmount = BigNumber.from(50);

        const tx1 = contract.connect(account1).deduct(account2.address, deductAmount);

        await expect(tx1).to.be.revertedWith('OwnERC20__GiverOrDeductorIsNotTheOwner');
        
        const tx2 = contract.connect(account1).deduct(account1.address, deductAmount);

        await expect(tx2).to.be.revertedWith('OwnERC20__GiverOrDeductorIsNotTheOwner');
    });
})