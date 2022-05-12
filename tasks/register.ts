import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

task('register', 'Registers a new account address')
    .addPositionalParam('target', 'the address to give tokens to')
    .setAction(async ({ target }: { target: string }, hre) => {
        const contract = await hre.ethers.getContract('OwnERC20');
        const tx = await contract.registerAddress(target);
        await tx.wait();
    });