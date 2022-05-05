import { hash } from "bcrypt";
import { ethers } from "ethers";
import { injectable } from "tsyringe";
import { Customer, CustomersRepository } from "../models/customer";

@injectable()
export class CustomersService {
    constructor(
        private customersRepository: CustomersRepository
    ) {}

    async signup(username: string, password: string): Promise<Customer> {
        const existingCustomer = await this.customersRepository.getByUsername(username);
        if (existingCustomer !== undefined) {
            throw new Error('user already exists');
        }

        const hashedPassword = await hash(password, parseInt(process.env.SALT_ROUNDS || ''));
        let { publicKey, privateKey } = ethers.Wallet.createRandom();

        const customer: Customer = {
            username,
            password: hashedPassword,
            publicKey,
            privateKey
        };

        this.customersRepository.insert(customer);

        return customer;
    }

    async getUserByUsername(username: string): Promise<Customer | undefined> {
        return this.customersRepository.getByUsername(username);
    }
}
