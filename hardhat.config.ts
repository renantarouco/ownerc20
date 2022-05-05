
import { HardhatUserConfig } from 'hardhat/types';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';

import './tasks/faucet';
import './tasks/give';

const config: HardhatUserConfig = {
  solidity: '0.8.7',
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};

export default config;