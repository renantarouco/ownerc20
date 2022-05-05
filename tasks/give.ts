import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

task('give', 'Gives (mint) OWN tokens to an account')
    .addPositionalParam('to', 'the address to give tokens to')
    .addPositionalParam('amount', 'the amount of tokens to give')
    .setAction(async ({ to, amount }: { to: string, amount: bigint }, hre) => {
        const contract = await hre.ethers.getContract('OwnERC20');
        const tx = await contract.give(to, amount);
        await tx.wait();
    });