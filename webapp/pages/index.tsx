import { Popover } from '@headlessui/react'
import Head from 'next/head'

export default function Index() {
  return (
    <>
    <Popover className="relative bg-white">
      <Head>
        <title>Own Wallet</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-8 w-auto sm:h-10"
                src=""
                alt="Logo"
              />
            </a>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <span className="text-gray-600">Welcome, username!</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto px-4 sm:px-6 pb-10">
        <header>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">You have:</h2>
        </header>
        <section className="text-center text-gray-700">
          <span className="text-8xl">50</span><span>OWN</span>
        </section>
        <footer className="text-center font-mono text-gray-500">
          <span>(Own Tokens)</span>
        </footer>
      </main>
    </Popover>
    </>
  )
};
