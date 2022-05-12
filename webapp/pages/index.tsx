import { Popover } from '@headlessui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery, useMoralisSubscription, OnLiveHandler } from 'react-moralis';
import { providers, Contract, Wallet, utils, BigNumber } from 'ethers';
import deployment from '../deployment.json';
import { OwnERC20 } from '../../typechain-types';
import config from '../config';
import { SpeakerphoneIcon, XIcon } from '@heroicons/react/solid';
import { toast } from 'react-toastify';

export default function Index() {
  const [ userAddress, setUserAddress ] = useState('');
  const [ userBalance, setUserBalance ] = useState<BigNumber>();
  const [ tokenSymbol, setTokenSymbol ] = useState('');
  const [ tokenName, setTokenName ] = useState('');
  const [ tokenDecimals, setTokenDecimals ] = useState(1);
  const [ isAddressRegistered, setIsAddressRegistered ] = useState(false);

  const { isAuthenticated, user, logout, Moralis } = useMoralis();

  const router = useRouter();

  useMoralisSubscription(
    'GiveEvents',
    q => q,
    [],
    {
      onUpdate: async data => {
        console.log('GIVE', data);
        const confirmed = await data.get('confirmed') as boolean;
        const to = await data.get('to') as string;
        if (confirmed === true) {
          const amount = await data.get('amount') as string;
          setUserBalance(userBalance?.add(amount));
          toast(`You were given ${utils.formatUnits(amount, tokenDecimals)} ${tokenSymbol}.`, {
            type: 'success'
          });
        }
      }
    }
  );

  const onSignOutClick = async () => {
    await logout();

    router.replace('/signin');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
    } else {
      const fetchData = async () => {
        const provider = new providers.JsonRpcProvider(config.NETWORK_URL);
        const contract = new Contract(
          deployment.contracts.OwnERC20.address,
          deployment.contracts.OwnERC20.abi,
          provider
        ) as OwnERC20;

        const userPrivateKey = await user?.get('ownPrivateKey');
        const userWallet = new Wallet(userPrivateKey, provider);
        const userAddress = await userWallet.getAddress();

        let balance = await contract.balanceOf(userAddress);
        const tokenSymbol = await contract.symbol();
        const tokenName = await contract.name();
        const tokenDecimals = await contract.decimals();

        const ownerWallet = new Wallet(
          config.PRIVATE_KEY,
          provider
        );

        let isAddressRegistered = await contract.isAddressRegistered(userAddress);
        if (!isAddressRegistered) {
          const tx = await contract.connect(ownerWallet).registerAddress(userAddress);
          await tx.wait();
        }

        isAddressRegistered = await contract.isAddressRegistered(userAddress);

        setUserAddress(userAddress);
        setUserBalance(balance);
        setTokenSymbol(tokenSymbol);
        setTokenName(tokenName);
        setTokenDecimals(tokenDecimals);
        setIsAddressRegistered(isAddressRegistered);
      };
      

      fetchData()
        .catch(error => console.error(error));
    }
  }, []);

  if (!user) return <></>;

  return (
    <>
    <Popover className="relative bg-white">
      <Head>
        <title>Own Wallet</title>
        <meta name="description" content="Own Token mock app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt=""
              />
            </a>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <span className="text-gray-600">Welcome, { user?.getUsername() }!</span>
            <a
              href="#"
              onClick={onSignOutClick}
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign out
            </a>
          </div>
        </div>
      </nav>
      <main className="mx-auto px-4 sm:px-6 pb-10">
        <header>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">You have:</h2>
        </header>
        <section className="text-center text-gray-700">
          <span className="text-8xl">{ utils.formatUnits(userBalance || 0, tokenDecimals) }</span><span>{ tokenSymbol }</span>
        </section>
        <footer className="text-center font-mono text-gray-500 flex-col">
          <span>({ tokenName })</span><br/>
          <span>{ userAddress }</span><br/>
          { (isAddressRegistered) ? (<span className="text-green-500">registered</span>) : (<span className="text-red-500">unregistered</span>) }
        </footer>
      </main>
    </Popover>
    </>
  );
}
