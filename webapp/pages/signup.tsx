import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react';
import { SignUpRequest, SignUpResponse } from './api/signup';
import styles from '../styles/Home.module.css'

const SignUp: NextPage = () => {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const onSubmitClick = async () => {
        try {
            const reqBody = {
                username, password
            } as SignUpRequest;
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
            const resBody = (await res.json()) as SignUpResponse;
            
        } catch (error) {
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
                    <img className="mx-auto h-12 w-auto" src="" alt="Workflow" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input value={ username } onChange={ ({ target }) => setUsername(target.value) }
                            id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm" placeholder="Username" />
                        </div>
                        <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input value={ password } onChange={ ({ target }) => setPassword(target.value) }
                            id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <button onClick={onSubmitClick}
                            type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-amber-400 group-hover:text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
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