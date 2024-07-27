/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '../../../components/Editor';
import { SidebarProvider, DesktopSidebar, MobileSidebar } from '../../../components/ui/Sidebar';
import Navbar from '../../../components/navbar';
import {
  getStoredWorkspaces,
  addFileToWorkspace,
  deleteFileFromWorkspace,
  loadDocFromWorkspace,
} from '@/utils/idb';

const Workspace = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [currentFile, setCurrentFile] = useState('');
  const [ydocs, setYdocs] = useState(new Map());
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    async function fetchWorkspace() {
      const workspaces = await getStoredWorkspaces();
      const currentWorkspace = workspaces.find((ws) => ws.id === id);
      if (currentWorkspace) {
        const doc = await loadDocFromWorkspace(id);
        const docs = currentWorkspace.docs || {};
        setWorkspace({ ...currentWorkspace, docs, doc });
        setCurrentFile(Object.keys(docs)[0] || '');
      } else {
        setWorkspace({ docs: {} });
      }
    }

    fetchWorkspace();
  }, [id]);

  const addFile = async () => {
    if (workspace && workspace.docs) {
      const newFileName = `untitled-${Object.keys(workspace.docs).length + 1}.md`;
      const { fileName, docID } = await addFileToWorkspace(id, newFileName);
      const updatedWorkspace = { ...workspace, docs: { ...workspace.docs, [fileName]: docID } };
      setWorkspace(updatedWorkspace);
      setCurrentFile(newFileName);
    }
  };

  const handleFileDelete = async (fileName) => {
    if (workspace && workspace.docs) {
      await deleteFileFromWorkspace(id, fileName);
      const updatedDocs = { ...workspace.docs };
      delete updatedDocs[fileName];
      setWorkspace({ ...workspace, docs: updatedDocs });
      setCurrentFile(Object.keys(updatedDocs).length > 0 ? Object.keys(updatedDocs)[0] : '');
    }
  };

  const workspacesList = workspace && workspace.docs
    ? Object.keys(workspace.docs).map((fileName) => ({ id: fileName, name: fileName }))
    : [];

  return (
    <SidebarProvider
      buttonText="Add File"
      onButtonClick={addFile}
    >
      <div className="flex h-screen flex-col">
        <Navbar username={username} />
        <div className="flex flex-1">
          {workspace && workspace.docs && (
            <>
              <DesktopSidebar workspaces={workspacesList} onDeleteWorkspace={handleFileDelete} />
              <MobileSidebar workspaces={workspacesList} onDeleteWorkspace={handleFileDelete} />
            </>
          )}
          <Editor currentFile={currentFile} ydocs={ydocs} setYdocs={setYdocs} workspaceID={id} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workspace;
