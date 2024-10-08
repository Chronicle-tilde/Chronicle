/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import {
  getStoredWorkspaces,
  addWorkspace,
  deleteWorkspace as deleteWorkspaceFromDB,
} from '../utils/idb'; // Ensure this path is correct
import { DesktopSidebar, MobileSidebar, SidebarProvider } from '../components/Sidebar_WS';
import { nanoid } from 'nanoid';

const Home = () => {
  const router = useRouter();
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      return storedUsername || 'Anonymous';
    }
    return 'Anonymous';
  });

  const [workspaces, setWorkspaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchWorkspaces() {
      const savedWorkspaces = await getStoredWorkspaces();
      setWorkspaces(savedWorkspaces.map((ws) => ({ id: ws.id, name: `${ws.id} ` })));
    }
    fetchWorkspaces();
  }, []);

  const createWorkspace = async () => {
    const workspaceID = `workspace-${nanoid(7)}`;
    await addWorkspace(workspaceID, username);
    setWorkspaces((prev) => [...prev, { id: workspaceID, name: `${workspaceID} ` }]);
    router.push(`/workspace/${workspaceID}`);
  };

  const deleteWorkspace = async (workspaceID) => {
    await deleteWorkspaceFromDB(workspaceID);
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceID));
  };

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SidebarProvider
      open={sidebarOpen}
      setOpen={setSidebarOpen}
      buttonText="Add Workspace"
      onButtonClick={createWorkspace}
    >
      <div className="flex h-screen flex-col bg-neutral-900 text-neutral-100">
        <Navbar username={username} />
        <div className="flex flex-grow">
          <DesktopSidebar workspaces={filteredWorkspaces} onDeleteWorkspace={deleteWorkspace} />
          <div className="flex flex-grow items-center justify-center">
            <main className="flex flex-col items-center">
              <h1 className="animated-gradient text-center text-8xl font-bold">Chronicle</h1>
              <h4 className="mt-4 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500 bg-clip-text text-center text-2xl font-semibold text-transparent">
                A Real Time Collaborative Markdown Editor.
              </h4>
            </main>
          </div>
          <MobileSidebar workspaces={filteredWorkspaces} onDeleteWorkspace={deleteWorkspace} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Home;
