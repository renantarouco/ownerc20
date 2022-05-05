import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

task('faucet', 'Gives fake ETH to an account')
    .addPositionalParam('to', 'the address to give tokens to')
    .setAction(async ({ to }: { to: string }, hre) => {
        if (hre.network.name === 'hardhat') {
            console.warn(
              "You are running the faucet task with Hardhat network, which" +
                " gets automatically created and destroyed every time. Use the Hardhat" +
                " option '--network localhost'"
            );
        }

        const [ sender ] = await hre.ethers.getSigners();
        const tx = await sender.sendTransaction({
            to,
            value: hre.ethers.constants.WeiPerEther
        });
        await tx.wait();
    });