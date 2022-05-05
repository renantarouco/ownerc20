import { singleton } from "tsyringe"

export type Customer = {
    username: string
    password: string
    publicKey: string
    privateKey: string
}

@singleton()
export class CustomersRepository {
    private data: Map<string, Customer>

    constructor() {
        this.data = new Map<string, Customer>();
    }

    getByUsername(username: string): Customer | undefined {
        return this.data.get(username);
    }

    insert(customer: Customer) {
        this.data.set(customer.username, customer);
    }
}
