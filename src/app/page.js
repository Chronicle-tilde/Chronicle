/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import Login from '../components/login';
import { getStoredWorkspaces, addWorkspace, deleteWorkspace } from '@/utils/yjs'; // Ensure you have deleteWorkspace function in your utils
import '../styles/styles.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem('username');
    return storedUsername || 'Anonymous';
  });

  const handleLoginSuccess = (newUsername) => {
    setUsername(newUsername);
    setIsLoggedIn(true);
    localStorage.setItem('username', newUsername);
  };

  const [workspaces, setWorkspaces] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkspaces() {
      const savedWorkspaces = await getStoredWorkspaces();
      setWorkspaces(savedWorkspaces);
    }
    fetchWorkspaces();
  }, []);

  const createWorkspace = async () => {
    const workspaceID = `workspace-${Date.now()}`;
    await addWorkspace(workspaceID);
    setWorkspaces((prev) => [...prev, workspaceID]);
    router.push(`/workspace/${workspaceID}?username=${username}`);
  };

  const removeWorkspace = async (workspaceID) => {
    await deleteWorkspace(workspaceID);
    setWorkspaces((prev) => prev.filter((id) => id !== workspaceID));
  };

  return (
    <div className="page-container">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <div>
            <Navbar username={username} />
            <div className="flex align-middle justify-center flex-wrap gap-6">
              {workspaces.map((id) => (
                <div key={id} className="card p-6 shadow-lg rounded-xl bg-white transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-2">{id}</h2>
                    <div className="flex justify-between mt-4 w-full">
                      <button
                        onClick={() => router.push(`/workspace/${id}`)}
                        className="btn btn-primary"
                      >
                        Enter
                      </button>
                      <button
                        onClick={() => removeWorkspace(id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button onClick={createWorkspace} className="btn btn-primary">
                Create Workspace
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
