import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

task('deduct', 'Deducts (burn) OWN tokens from an account')
    .addPositionalParam('from', 'the address to deduct tokens from')
    .addPositionalParam('amount', 'the amount of tokens to deduct')
    .setAction(async ({ from, amount }: { from: string, amount: bigint }, hre) => {
        const contract = await hre.ethers.getContract('OwnERC20');
        const tx = await contract.deduct(from, amount);
        await tx.wait();
    });