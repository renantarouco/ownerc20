import { ethers } from "ethers";
import { injectable } from "tsyringe";

@injectable()
export class OwnERC20Service {
    private provider: ethers.providers.Provider
    private ownerWallet: ethers.Wallet
    private contract: ethers.Contract

    constructor(
        networkUrl: string,
        ownerPrivateKey: string,
        contractAddress: string,
        contractAbi: ethers.ContractInterface
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(networkUrl);
        this.ownerWallet = new ethers.Wallet(ownerPrivateKey, this.provider);
        this.contract = new ethers.Contract(
            contractAddress,
            contractAbi
        );
    }

    async registerAddress(privateKey: string) {
        const wallet = new ethers.Wallet(privateKey, this.provider);
        const address = await wallet.getAddress();
        const tx = await this.contract.connect(this.ownerWallet).registerAddress(address);
        await tx.wait()
    }
}