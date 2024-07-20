/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Navbar = ({ username }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between h-12 w-auto rounded-3xl bg-[#181818] px-4 shadow-md transition-all hover:bg-[#181818]">
        <a href='/' className="cursor-pointer font-bold bg-[#181818] text-[#7351a9] text-3xl hover:bg-[#181818]">
          Chronicle
        </a>
        <div className="flex items-center">
          <span className="text-white">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
