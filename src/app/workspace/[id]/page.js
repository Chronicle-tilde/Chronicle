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
import { WebrtcProvider } from 'y-webrtc';

const Workspace = () => {
  const { id } = useParams(); // <- YOU GET YOUR WORKSPACE ID HERE

  const [workspace, setWorkspace] = useState(null);
  const [currentFile, setCurrentFile] = useState('');
  const [ydocs, setYdocs] = useState(new Map());
  const [username, setUsername] = useState('');
  const [fileID, setFileID] = useState('');
  const [documentID, setDocumentID] = useState('');
  const [filesList, setfilesList] = useState([]);

  // const [filesList, setFilesList] = useState(workspace && workspace.docs
  //   ? Object.keys(workspace.fileIDs).map((fileName) => ({ id: fileName, name: fileName }))
  //   : []
  // )

  // const filesList =
  //   workspace && workspace.docs
  //     ? Object.keys(workspace.fileIDs).map((docID) => ({ id: docID, name: docID }))
  //     : [];

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');

    async function fetchWorkspace() {

      // YOU CAN REUSE THE BELOW CODE TO GET WORKSPACE INFO FROM INDEX DB
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
        setfilesList(Object.keys(docnames).map((fileIndex => ({
          id: docs[fileIndex],
          name: docnames[fileIndex],
        }))));
      } else {
        setWorkspace({ docs: {} });
      }
      const ydoc = new Y.Doc();
      const provider = new WebrtcProvider(id,ydoc, {
        signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
      });

      // provider = newWebrtcprovider(id, {signalling: ...}) <- `id` here is from useParams in line 23
      // Get the ydoc from this provider
      // ydoc = provider.get('workspace') // might not be the correct syntax. Only indicative of what you need to do
      const fileIDsYArray = ydoc.getArray('fileIDs')
      const fileNamesYArray = ydoc.getArray('fileName')
      //
      // if fileIDsYArray is empty -> push changes to y array from indexed db
      //
      //
      //
      // You know how to get workspace info from index db because it's implemented above
      //
      // else
      //
      // tempArray = []
      // for(i := 0; i < fileIDsYArray.length; i++){
      // tempArray.push(
      // {
      //  id: fileIDsYArray.get(i), 
      //  name: fileNamesYArray.get(i)})
      // }
      // )
      provider.on('synced', async () => {
        if (fileIDsYArray.length === 0 && currentWorkspace) {
          const docs = currentWorkspace.fileIDs || {};
          const docnames = currentWorkspace.filenames || [];
          Object.keys(docs).forEach((key) => {
            fileIDsYArray.push([docs[key]]);
            fileNamesYArray.push([docnames[key]]);
          });
        } else {
          const tempArray = [];
          for (let i = 0; i < fileIDsYArray.length; i++) {
            tempArray.push({
              id: fileIDsYArray.get(i),
              name: fileNamesYArray.get(i),
            });
          }
          setFilesList(tempArray);
        }});

      // FLOW:
      // If you're a person who just created the workspace, Then when you connect to the provider, you won't find any yarray there
      // so you push stuff from db on to there (which will also be empty)
      //
      // If you're a collaborator joining, then when you login to the provider (join the room), you'll find a y array set by someone else there
      // So you don't touch your indexdb, but fetch the fileIDs and fileNames from webrtc
      // BUT, remember to put these fileIDs and fileNames in your indexdb, why?
      //
      // Because if everyone leaves the webrtc room and comes back later, then someone should have the latest version of the saved data
      // It's a messy solution but you'll have the same data as the first person that joins the room
      const updatedWorkspace = {
        id,
        fileIDs: Object.fromEntries(fileIDsYArray.toArray().map((id, index) => [id, id])),
        filenames: fileNamesYArray.toArray(),
      };
      await addFileToWorkspace(id, updatedWorkspace);
      setWorkspace(updatedWorkspace);
      setCurrentFile(Object.keys(updatedWorkspace.fileIDs)[0] || '');

    setYdocs((prevYdocs) => new Map(prevYdocs.set(id, ydoc)));
  }

    fetchWorkspace();
  }, [id]);

  const addFile = async () => {
    if (workspace && workspace.fileIDs) {
      const fileIndex = Object.keys(workspace.fileIDs).length + 1
      const newFileName = `untitled-${nanoid(3)}`;
      const { filename, docID } = await addFileToWorkspace(id, newFileName);
      // ALSO ADD TO THE Y ARRAY HERE
      const fileIDsYArray = ydoc.getArray('fileIDs');
      const fileNamesYArray = ydoc.getArray('fileName');
      fileIDsYArray.push([docID]);
      fileNamesYArray.push([newFileName]);
      const updatedWorkspace = { ...workspace, 
        docs: { ...workspace.docs, [fileIndex]: docID },
        fileIDs: {...workspace.fileIDs, [fileIndex]:docID},
        filenames: [...workspace.filenames, newFileName],
      
      };
      setWorkspace(updatedWorkspace);
      setCurrentFile(newFileName);
      setfilesList([...filesList, { id: docID, name: newFileName }])
    }
  };
  const handleFileDelete = async (fileName) => {
    if (workspace && Array.isArray(workspace.fileIDs)) {
      deleteFileFromWorkspace(id, fileName);
      // ALSO DELETE FROM Y ARRAY
      const fileIDsYArray = ydoc.getArray('fileIDs');
      const fileNamesYArray = ydoc.getArray('fileName');
      const ydoc = ydocs.get(id);
      const indexToDelete = fileNamesYArray.toArray().indexOf(fileName);
      if (indexToDelete > -1) {
        fileIDsYArray.delete(indexToDelete, 1);
        fileNamesYArray.delete(indexToDelete, 1);
      }
      console.log(`hello i am ${fileName}`);
      setfilesList(filesList.filter((file) => file.id !== fileName));
    }
  };

  const handleFileClick = (fileID) => {
    console.log(fileID);
    setFileID(fileID);
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
              //workspaceID={currentWorkspace}
              />
              <FilesMobileSidebar
                files={filesList}
                onDeleteFile={handleFileDelete}
                onCurrentFileClick={handleFileClick}
              />
            </>
          )}
          <Editor fileID={fileID} />
        </div>
      </div>
    </FilesSidebarProvider>
  );
};

export default Workspace;
