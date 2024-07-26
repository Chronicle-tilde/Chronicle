/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoMenu } from 'react-icons/io5';
import { useSidebar } from '../components/ui/Sidebar';
import { initializeWorkspace } from '@/utils/receiversend';
const Navbar = ({ username }) => {
  const router = useRouter();
  const { open, setOpen } = useSidebar();

  const toggleSidebar = () => setOpen(prev => !prev);
  const hbo = ()  =>{

  }
  return (
    <div className="relative">
      <div className="flex h-16 items-center justify-between border-b border-gray-900 bg-[#1F1F1F] shadow-lg">
        <button
          className="mr-auto p-4 bg-transparent text-2xl hover:bg-transparent"
          onClick={toggleSidebar}
        >
          <IoMenu />
        </button>
        <button
          className="mr-auto bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent transition-opacity duration-300 hover:opacity-80"
          onClick={() => router.push('/')}
        >
          Chronicle
        </button>
        <textarea>
          <input type="text" className='text-black'></input>
        </textarea>
        <button onClick={initializeWorkspace}>Collab</button>
      </div>
    </div>
  );
};

export default Navbar;
