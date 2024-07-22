'use client';
import React from 'react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import '../styles/styles.css';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { FaGithub } from "react-icons/fa";

const Home = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-gradient text-white">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 bg-clip-text text-7xl font-extrabold text-transparent">
            Chronicle
          </h1>
          <h4 className="mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-semibold text-transparent">
            ⚡<em>Blazin'</em> Fast.
          </h4>
        </div>
      </main>
      <div className="flex justify-center items-center mb-8">
        <button
          className="flex items-center rounded-lg bg-green-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-700"
          onClick={() => router.push('/workspaces')}
        >
          Go to Workspaces
          <ArrowRightOnRectangleIcon className="ml-2 h-6 w-6" />
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <a
          href="https://github.com/homebrew-ec-foss/Chronicle" // Replace with your actual GitHub repo URL
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white shadow-md transition-colors duration-200 hover:bg-gray-700"
        >
          <FaGithub className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default Home;
