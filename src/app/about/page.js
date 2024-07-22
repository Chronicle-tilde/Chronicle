/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React from 'react';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/navigation';
import '../../styles/styles.css';

const About = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1f1f1f] rounded-3xl via-[#2b2b2b] to-[#1f1f1f] text-white overflow-hidden">
      <Navbar buttonText={'Back to Home'} onButtonClick={() => router.push('/')} />
      <div className="flex-grow flex flex-col items-center justify-center py-5">
        <div className="text-left mb-6 mr-auto">
          <h1 className="text-5xl font-extrabold bg-clip-text mb-72 mr-auto ml-44">
            About Us
          </h1>
          <h4 className="text-2xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-indigo-400 mr-auto ml-44">
            🚀 Learn More About Our Journey
          </h4>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-lg mt-4">Welcome to the About Us page! Here, you can learn more about our team and mission.</p>
            <p className="text-lg mt-4">Our goal is to create innovative solutions and provide the best user experience possible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
