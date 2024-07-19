'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '../../../components/Editor'; // Assuming Editor component exists
import Sidebar from '../../../components/sidebar';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import Navbar from '@/components/navbar';

const Workspace = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [currentFile, setCurrentFile] = useState('');
  const [isRenaming, setIsRenaming] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [ydocs, setYdocs] = useState(new Map());
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);

    persistence.once('synced', () => {
      let workspaceData = ydoc.getMap('workspace').get('workspaceData');
      if (!workspaceData || !workspaceData.Docs) {
        workspaceData = {
          WorkspaceTitle: 'My workspace',
          Nickname: storedUsername,
          Docs: {},
        };
        ydoc.getMap('workspace').set('workspaceData', workspaceData);
      }

      setWorkspace(workspaceData);

      const filesMap = new Map();
      Object.entries(workspaceData.Docs).forEach(([docname, docID]) => {
        const doc = new Y.Doc();
        const docPersistence = new IndexeddbPersistence(docID, doc);
        filesMap.set(docname, { doc, persistence: docPersistence });
      });

      setYdocs(filesMap);
      setCurrentFile(Object.keys(workspaceData.Docs)[0] || '');
    });

    return () => {
      ydoc.destroy();
    };
  }, [id]);

  const addFile = () => {
    const newFileName = `untitled-${Object.keys(workspace.Docs).length + 1}.md`;
    const newDocID = `doc-${Date.now()}`;
    const newDoc = new Y.Doc();
  
    // Create new IndexeddbPersistence instance for the new document
    const newDocPersistence = new IndexeddbPersistence(newDocID, newDoc);
  
    // Update the workspace with the new file
    const updatedDocs = { ...workspace.Docs, [newFileName]: newDocID };
    const updatedWorkspace = { ...workspace, Docs: updatedDocs };
  
    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);
    ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);
  
    persistence.once('synced', () => {
      // Update local state with the new file and its document
      setWorkspace(updatedWorkspace);
      setYdocs(prev => new Map(prev).set(newFileName, { doc: newDoc, persistence: newDocPersistence }));
      setCurrentFile(newFileName);
    });
  };
  

  const handleFileNameChange = (index, oldFileName) => {
    if (newFileName.trim() && newFileName !== oldFileName) {
      const updatedDocs = { ...workspace.Docs };
      const docID = updatedDocs[oldFileName];
      delete updatedDocs[oldFileName];
      updatedDocs[newFileName] = docID;
  
      const updatedWorkspace = { ...workspace, Docs: updatedDocs };
      const ydoc = new Y.Doc();
      const persistence = new IndexeddbPersistence(id, ydoc);
      ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);
  
      persistence.once('synced', () => {
        setWorkspace(prevWorkspace => ({
          ...prevWorkspace,
          Docs: updatedDocs
        }));
        setYdocs(prevYdocs => {
          const updatedYdocs = new Map(prevYdocs);
          const fileData = updatedYdocs.get(oldFileName);
          updatedYdocs.delete(oldFileName);
          updatedYdocs.set(newFileName, fileData);
          return updatedYdocs;
        });
        setIsRenaming(null);
        setNewFileName('');
        setCurrentFile(newFileName);
      });
    }
  };
  
  const handleFileDelete = (fileName) => {
    // Create a copy of the workspace Docs to remove the file
    const updatedDocs = { ...workspace.Docs };
    delete updatedDocs[fileName];
  
    // Update the workspace state
    const updatedWorkspace = { ...workspace, Docs: updatedDocs };
    
    // Create a new Y.Doc instance and set the updated workspace
    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);
    ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);
  
    persistence.once('synced', () => {
      // Clean up the old persistence instance if it exists
      if (ydocs.has(fileName)) {
        ydocs.get(fileName)?.persistence.destroy(); // Close and clean up the persistence instance
      }
      
      // Remove the file from the state
      setWorkspace(updatedWorkspace);
      setYdocs(prev => {
        const updatedYdocs = new Map(prev);
        updatedYdocs.delete(fileName);
        return updatedYdocs;
      });
      
      // Set the current file to the next available file or empty if none
      setCurrentFile(Object.keys(updatedDocs).length > 0 ? Object.keys(updatedDocs)[0] : '');
    });
  };
      

  useEffect(() => {
    console.log('Workspace:', workspace);
    console.log('Current File:', currentFile);
    console.log('Ydocs:', ydocs);
  }, [workspace, currentFile, ydocs]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar username={username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          files={Object.keys(workspace?.Docs || {})}
          currentFile={currentFile}
          onFileClick={setCurrentFile}
          onFileNameChange={handleFileNameChange}
          onFileDelete={handleFileDelete}
          onCreateFile={addFile}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
          setNewFileName={setNewFileName}
          newFileName={newFileName}
        />
        <div className="flex-1 ml-4">
          {currentFile && ydocs.has(currentFile) ? (
            <Editor doc={ydocs.get(currentFile)?.doc} />
          ) : (
            <p>No file selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
