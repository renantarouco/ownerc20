import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type Middleware = (handler: NextApiHandler) => NextApiHandler;

export const contentTypeMiddleware = (contentType: string): Middleware => (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    if (req.headers['content-type'] !== contentType) {
        res.status(400).end();
        return;
    }

    return handler;
};

export const methodsMiddleware = (methods: string[]): Middleware => (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    if (!methods.includes(req.method || '')) {
        res.status(405).end();
        return;
    }

    return handler;
};