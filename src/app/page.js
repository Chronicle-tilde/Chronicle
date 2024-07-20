/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import { getStoredWorkspaces, addWorkspace, deleteWorkspace } from '@/utils/yjs'; // Ensure you have deleteWorkspace function in your utils
import '../styles/styles.css';

const Home = () => {
  const animals = [
    'Cat', 'Dog', 'Elephant', 'Lion', 'Tiger', 'Zebra', 'Panda', 'Koala', 'Kangaroo', 
    'Giraffe', 'Monkey', 'Hippopotamus', 'Rhinoceros', 'Cheetah', 'Fox', 'Wolf', 
    'Bear', 'Deer', 'Snake', 'Penguin', 'Owl',
  ];

  const [workspaces, setWorkspaces] = useState([]);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    let storedUsername = sessionStorage.getItem('username');
    if (!storedUsername) {
      const randomIndex = Math.floor(Math.random() * animals.length);
      storedUsername = 'Anonymous ' + animals[randomIndex];
      sessionStorage.setItem('username', storedUsername);
    }
    setUsername(storedUsername);

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
    router.push(`/workspace/${workspaceID}`);
  };

  const removeWorkspace = async (workspaceID) => {
    await deleteWorkspace(workspaceID);
    setWorkspaces((prev) => prev.filter((id) => id !== workspaceID));
  };

  return (
    <div className="page-container">
      <Navbar username={username} />
      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="text-white font-bold ml-4 text-4xl">
          What's on your mind today, {username}?
        </div>
        <div className="mt-14"></div>
        <div className="flex justify-center flex-wrap gap-6">
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
      </div>
      <div className="flex justify-center mt-8">
        <button onClick={createWorkspace} className="btn btn-primary">
          Create Workspace
        </button>
      </div>
    </div>
  );
};

export default Home;
