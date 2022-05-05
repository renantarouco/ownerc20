This project is the implementation of an example application with the following components:

- _onchain:_ implementation of a token using ERC20 standard from @openzeppelin;
- _offchain webapp (next.js):_
  - _backend api:_ used to manage customers e with custodial wallets
  - _frontend:_ provides pages for registration, authentication and dashboard with information

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies:

```bash
yarn
# or
npm install
```

## On chain

### Run tests

To get an overview of the possible actions provided by the OwnERC20 contract:

```bash
yarn hardhat test
# or
npx hardhat test
```

✔ should deploy with initial supply assigned to the owner
✔ should return zero balance for new wallets
✔ should allow the registration of a new address
✔ should allow the unregistration an address
✔ should allow transfer from owner to other accounts
✔ should allow transfer from other accounts to owner
✔ shouldnt allow transfers from accounts other than the owner
✔ shouldnt allow owner to give (mint) to unregistered addresses
✔ should allow owner to give (mint) tokens
✔ shouldnt allow accounts to give (mint) tokens to other accounts (including themselves)
✔ shouldnt allow owner to deduct (burn) from unregistered addresses
✔ should allow owner to deduct (burn) tokens
✔ shouldnt allow accounts to deduct (burn) tokens from other accounts (including themselves)

### Deploy

To deploy configure the target network on `hardhat.config.ts` in the `networks` property. For example in rinkeby:

```typescript
const config: HardhatUserConfig = {
  // ... root level
  networks: {
    rinkeby: {
      url: "<url here>",
      chainId: 1, // <chain id, 1 is mainnet>
      accounts: ["<your private key>"],
    },
  },
};

export default config;
```

And then in a terminal use the command to deploy, made available by `hardhat-deploy` plugin:

```bash
yarn hardhat deploy --network rinkeby
# or
npx hardhat deploy --network rinkeby
```

### Tasks

In order to get some useful control of the application, some tasks are provided:

- `faucet <to>`: transfers 1 ether from the 0-index account to another (localhost to send some fake ether using default accounts)

- `give <to> <amount>`: mints some tokens into an account

- `deduct <from> <amount>`: burns some tokens from an account

## Off chain

The off chain application code is in `./webapp`.

### Configure

Set the values in `./webapp/config.ts`:

```typescript
export default {
  PRIVATE_KEY: "<private key>",
  NETWORK_URL: "<network url>",
  SALT_ROUNDS: 0, // for password encriptions
  JWT_SECRET: "<secret>",
};
```

### Run backend and frontend development server

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

#### Front end

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

[API routes](https://nextjs.org/docs/api-routes/introduction)
