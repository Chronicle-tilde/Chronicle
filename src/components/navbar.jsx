/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import '../styles/styles.css';
import { useRouter } from 'next/navigation';

const Navbar = ({ username }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount === 2) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
      }, 3000);
      setClickCount(0);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('username');

    router.push('/'); 
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between h-12 w-auto rounded-3xl bg-[#6b40af] px-4 shadow-md transition-all hover:bg-[#7351a9]">
        <button className="cursor-pointer font-black text-white" onClick={handleClick}>
          Chronicle
        </button>
        <div className="flex items-center">
          {username && <div className="text-white font-bold mr-4">{username}</div>}
          <a href="#" className="text-white" onClick={handleSignOut}>Logout</a>
        </div>
      </div>
      {showEasterEgg && (
        <div className="absolute left-1/2 top-16 -translate-x-1/2 transform rounded bg-white p-4 shadow-md">
          <p className="text-gray-800">Bababoi</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
