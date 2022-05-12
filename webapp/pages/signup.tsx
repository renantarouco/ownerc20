import type { NextPage } from 'next'
import Head from 'next/head'
import { MouseEventHandler, useState } from 'react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useMoralis } from 'react-moralis';
import { Wallet } from 'ethers';
import { LockClosedIcon } from '@heroicons/react/solid';

const SignUp: NextPage = () => {
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const { signup } = useMoralis();

    const router = useRouter();

    const onSubmitClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        try {
            const wallet = Wallet.createRandom();

            const user = await signup(
                username,
                password,
                email,
                {
                    'ownPrivateKey': wallet.privateKey,
                    'ownPublicKey': wallet.publicKey,
                    'ownMnemonic.locale': wallet.mnemonic.locale,
                    'ownMnemonic.path': wallet.mnemonic.path,
                    'ownMnemonic.phrase': wallet.mnemonic.phrase
                }
            );

            if (user) {
                router.replace('/');
            }
        } catch (error) {
            // TODO: cast notification toast with error message
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Own - Sign up</title>
                <meta name="description" content="Own - SignUp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                <div>
                    <img
                    className="mx-auto h-12 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="username" className="sr-only">
                        Username
                        </label>
                        <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Username"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">
                        Email
                        </label>
                        <input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="E-mail"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                        Password
                        </label>
                        <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        />
                    </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Already have an one? Sign in!
                        </a>
                    </div>
                    </div>

                    <div>
                    <button
                        onClick={onSubmitClick}
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        Sign up
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;