/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/navigation';
import { addWorkspace, getStoredWorkspaces, deleteWorkspace } from '../../utils/yjs'; // Update if needed
import '../../styles/styles.css';
import {nanoid} from 'nanoid';

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [username, setUsername] = useState('');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const router = useRouter();

  useEffect(() => {
    let storedUsername = sessionStorage.getItem('username');
    if (!storedUsername) {
      storedUsername = 'Anonymous';
    }
    setUsername(storedUsername);

    async function fetchWorkspaces() {
      try {
        const savedWorkspaces = await getStoredWorkspaces();
        setWorkspaces(savedWorkspaces);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    }

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim() === '') {
      alert('Workspace name cannot be empty');
      return;
    }

    try {
      const newWorkspaceId = newWorkspaceName.trim();
      await createWorkspace(newWorkspaceId);

      const savedWorkspaces = await getStoredWorkspaces();
      setWorkspaces(savedWorkspaces);
      setNewWorkspaceName('');
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const createWorkspace = async (name) => {
    const workspaceID = `workspace-${nanoid(7)}`;
    await addWorkspace(workspaceID);
    setWorkspaces((prev) => [...prev, workspaceID]);
    router.push(`/workspace/${workspaceID}`);
  };

  const removeWorkspace = async (workspaceID) => {
    await deleteWorkspace(workspaceID);
    setWorkspaces((prev) => prev.filter((id) => id !== workspaceID));
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Your Workspaces</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-3 px-4 text-gray-300">Workspace ID</th>
                <th className="py-3 px-4 text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((id) => (
                <tr key={id} className="border-b border-gray-700">
                  <td className="py-4 px-4">{id}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => router.push(`/workspace/${id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                      >
                        Enter
                      </button>
                      <button
                        onClick={() => removeWorkspace(id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center mt-8">
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="New Workspace Name"
            className="bg-gray-800 border border-gray-600 text-white rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            onClick={handleCreateWorkspace}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workspaces;
