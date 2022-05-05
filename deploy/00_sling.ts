import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy, log } = hre.deployments;

    log('deploying to', hre.network.name);

    await deploy('OwnERC20', {
        from: deployer,
        args: [ 100 ],
        log: true
    });
}

export default deployFunction;

deployFunction.tags = [ 'OwnERC20' ];