/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SparklesCore } from '../components/ui/Sparkle'; // Adjust the import path as necessary

const Navbar = ({ username, availableAnimals = [], onAnimalSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex h-12 w-full items-center justify-between rounded-3xl bg-[#181818] px-4 shadow-md transition-all hover:bg-[#383838]">
        <div className="relative">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-400 via-pink-300 to-indigo-400 bg-clip-text text-2xl font-black text-transparent"
          >
            Chronicle
          </a>
          <SparklesCore
            speed={10}
            particleDensity={500}
            className="absolute left-0 top-0 h-full w-full"
          />
        </div>
        <div className="relative flex items-center space-x-4">
          <button
            onClick={toggleDropdown}
            className="bg-transparent text-base font-medium text-white hover:bg-neutral-500"
          >
            {username}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg">
              <ul className="py-1">
                {availableAnimals.map((animal) => (
                  <li
                    key={animal}
                    className="cursor-pointer px-4 py-2 text-white hover:bg-gray-700"
                    onClick={() => {
                      onAnimalSelect(animal);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {animal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
