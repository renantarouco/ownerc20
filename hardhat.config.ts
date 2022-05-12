
import { HardhatUserConfig } from 'hardhat/types';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';

import './tasks/faucet';
import './tasks/register';
import './tasks/give';
import './tasks/deduct';

const config: HardhatUserConfig = {
  solidity: '0.8.7',
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 4,
      accounts: [ '0x7c1d9b2316ccb6ad40faac40be601fe4b7d15cc1a99bedbdc164f5e11bc311ce' ]
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};

export default config;