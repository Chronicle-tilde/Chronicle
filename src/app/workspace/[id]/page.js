// page.js
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '../../../components/Editor';
import {
  FilesSidebarProvider,
  FilesDesktopSidebar,
  FilesMobileSidebar,
} from '../../../components/Sidebar_Files';
import Navbar from '../../../components/navbar';
import * as Y from 'yjs';
import { nanoid } from 'nanoid'
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
  const [filename, setFileName] = useState('');
  const [documentID, setDocumentID] = useState('');

  // const [filesList, setFilesList] = useState(workspace && workspace.docs
  //   ? Object.keys(workspace.fileIDs).map((fileName) => ({ id: fileName, name: fileName }))
  //   : []
  // )

  // const filesList =
  //   workspace && workspace.docs
  //     ? Object.keys(workspace.fileIDs).map((docID) => ({ id: docID, name: docID }))
  //     : [];
const[filesList,setfilesList]=useState([]);
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
    async function fetchWorkspace() {
      const workspaces = await getStoredWorkspaces();
      const currentWorkspace = workspaces.find((ws) => ws.id === id);
      if (currentWorkspace) {
        console.log('has currebt workspace')
        const doc = await loadDocFromWorkspace(id);
        const docs = currentWorkspace.fileIDs || {};
        const docnames = currentWorkspace.filenames || [];
        console.log(docs);
        setWorkspace({ ...currentWorkspace, docs, doc });
        setCurrentFile(Object.keys(docs)[0] || '');
        setfilesList(Object.keys(docs).map((fileIndex => ({
          id: docs[fileIndex],
          name: docnames[fileIndex],
        }))));
      }else {
        setWorkspace({ docs: {} });
      }
    }

    fetchWorkspace();
  }, [id]);
  const addFile = async () => {
    if (workspace && workspace.fileIDs) {
      const fileIndex = Object.keys(workspace.fileIDs).length + 1
      const newFileName = `untitled-${nanoid(3)}`;
      const { filename, docID } = await addFileToWorkspace(id, newFileName);
      const updatedWorkspace = { ...workspace, docs: { ...workspace.docs, [fileIndex]: docID } };
      setWorkspace(updatedWorkspace);
      setCurrentFile(newFileName);
      setfilesList([...filesList, { id: docID, name: newFileName }])
    }
  };
  const handleFileDelete = async (fileName) => {
    if (workspace && Array.isArray(workspace.fileIDs)) {
      deleteFileFromWorkspace(id, fileName);
      setfilesList(filesList.filter((file) => file.id !== fileName));
    }
  };

  const handleFileClick = (filename) => {
    console.log(filename);
  };
  return (
    <FilesSidebarProvider buttonText="Add File" onButtonClick={addFile}>
      <div className="flex h-screen flex-col">
        <Navbar username={username} />
        <div className="flex flex-1">
          {workspace && workspace.docs && (
            <>
              <FilesDesktopSidebar
                files={filesList}
                onDeleteFile={handleFileDelete}
                onCurrentFileClick={handleFileClick}
              />
              <FilesMobileSidebar
                files={filesList}
                onDeleteFile={handleFileDelete}
                onCurrentFileClick={handleFileClick}
              />
            </>
          )}
          <Editor fileID={filename} />
        </div>
      </div>
    </FilesSidebarProvider>
  );
};

export default Workspace;
