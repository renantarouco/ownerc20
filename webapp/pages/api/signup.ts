import { NextApiRequest, NextApiResponse } from 'next';
import container from '../../di';
import { Customer } from '../../models/customer';
import { AuthenticationService } from '../../services/auth';
import { CustomersService } from '../../services/customers';
import { OwnERC20Service } from '../../services/ownerc20';

export type SignUpRequest = Omit<Customer, 'publicKey' | 'privateKey'>;

export type SignUpResponse = Pick<Customer, 'username'> & { token: string };

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).end();
        return;
    }

    const { username, password } = req.body as SignUpRequest;

    // TODO: validate username and password

    try {
        const customersService = container.resolve(CustomersService);
        const customer = await customersService.signup(username, password);

        const ownERC20Service = container.resolve(OwnERC20Service);
        await ownERC20Service.registerAddress(customer.privateKey);
        const authenticationService = container.resolve(AuthenticationService);
        const token = await authenticationService.signin(username, password);
    
        const resBody: SignUpResponse = {
            username: customer.username,
            token: token
        };

        res.json(resBody);
    } catch (error) {
        console.error(error);

        switch ((error as Error).message) {
            case 'user already exists':
                res.status(409).end();
                return;
            case 'customer not found':
            case 'passwords dont match':
                res.status(401).end();
                return;
            default:
                res.status(500).end();
                return;
        }
    }
}