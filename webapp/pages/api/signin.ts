import { NextApiRequest, NextApiResponse } from 'next';
import { Customer } from '../../models/customer';
import container from '../../di';
import { AuthenticationService } from '../../services/auth';

type SignInRequest = Omit<Customer, 'publicKey' | 'privateKey'>;

type SignInResponse = Pick<Customer, 'username'> & { token: string };

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).end();
        return;
    }

    const { username, password } = req.body as SignInRequest;

    try {
        const autheticationService = container.resolve(AuthenticationService);
        const token = await autheticationService.signin(username, password);
        
        const resBody: SignInResponse = {
            username: username,
            token,
        }

        res.json(resBody);
    } catch (error) {
        console.error(error);

        switch ((error as Error).message) {
            case 'customer not found':
            case 'passwords dont match':
                res.status(401).end();
                return;
            default:
                res.status(500).end();
                return;
        }
    }
};