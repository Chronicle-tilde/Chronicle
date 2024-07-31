/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoMenu } from 'react-icons/io5';
import { useSidebar } from './Sidebar_WS';
import { useFilesSidebar } from './Sidebar_Files';
import { initializeWorkspace } from '@/utils/receiversend';
import { useState } from 'react';
import {setupws,joinws} from '../utils/receiversend';
import { setupwsforsharing } from '@/utils/idb';

const Navbar = () => {
  const router = useRouter();
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const { open: filesSidebarOpen, setOpen: setFilesSidebarOpen } = useFilesSidebar();
  const[wsID,setwsID]=useState('');
  // Function to toggle both sidebars
  const toggleSidebars = () => {
    setSidebarOpen((prev) => !prev);
    setFilesSidebarOpen((prev) => !prev);
  };
  // path-to-getDB.js or path-to-getDB.ts
async function getDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
console.log(`hohoho ${wsID}`);
  const sendCollab = async() =>{
    //const db= await getDB(wsID);
    setupwsforsharing(wsID);
  }
  const receiveCollab = async()=>{
    joinws(wsID);
  }
  return (
    <div className="relative">
      <div className="flex h-16 items-center justify-between border-b border-gray-900 bg-[#1F1F1F] shadow-lg">
        <button
          className="mr-auto bg-transparent p-4 text-2xl hover:bg-transparent"
          onClick={toggleSidebars}
        >
          <IoMenu />
        </button>
        <button
          className="mr-auto bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent transition-opacity duration-300 hover:opacity-80"
          onClick={() => router.push('/')}
        >
          Chronicle
        </button>
        <textarea
        className="text-black"
        value={wsID}
        onChange={(e) => setwsID(e.target.value)}
        placeholder="Enter Workspace ID"
      />
      <button onClick={sendCollab}>Send</button>
      <button onClick={receiveCollab}>Receive</button>
      </div>
    </div>
  );
};

export default Navbar;
