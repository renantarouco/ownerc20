import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { CustomersRepository } from "../models/customer";

@injectable()
export class AuthenticationService {
    constructor(
        private customersRepository: CustomersRepository,
        private secret: string
    ) {}

    async signin(username: string, password: string): Promise<string> {
        const customer = this.customersRepository.getByUsername(username);

        if (customer === undefined) {
            throw new Error('customer not found');
        }

        const match = await compare(password, customer.password);
        if (!match) {
            throw new Error('passwords dont match');
        }
        
        return sign({username}, this.secret, { expiresIn: 300 });
    }
}