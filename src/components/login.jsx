/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      onLoginSuccess(username);
    } else {
      alert("Please enter a username.");
    }
    setUsername('');
  };

  const handleAnonymousLogin = () => {
    onLoginSuccess('Anonymous');
    setUsername('');
  };

  return (
    <div className="flex items-center min-h-screen bg-black w-full">
      {/* Transparent left division with margin to move it further left */}
      <div className="flex-1 flex items-center justify-center pl-16">
        <div className="w-80 rounded-3xl shadow-md p-6 bg-transparent">
          <h1 className="text-6xl font-bold text-white mb-4 text-center">Chronicle</h1>
          <p className="text-xl text-white text-center">A blazin' fast real-time collaborative markdown editor</p>
        </div>
      </div>
      {/* Right login form */}
      <div className="w-80 bg-gray-800 rounded-3xl shadow-md p-6 mr-32">
        <p className="text-2xl font-bold text-white mb-9 text-center">Login</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
        />
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={handleLogin}
            className="w-3/4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={handleAnonymousLogin}
            className="w-3/4 py-2 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition duration-200"
          >
            Login as Anonymous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
