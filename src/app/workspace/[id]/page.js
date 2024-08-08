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
} from '../../../utils/idb';
import { getDB } from '@/utils/receiversend';
import { WebrtcProvider } from 'y-webrtc';

// Define the Workspace component
const Workspace = () => {
  const { id } = useParams(); // <- YOU GET YOUR WORKSPACE ID HERE
  // id is 'workspace-7digit'

  const [workspace, setWorkspace] = useState(null);
  const [currentFile, setCurrentFile] = useState('');
  const [ydocs, setYdocs] = useState(new Map());
  const [username, setUsername] = useState('');
  const [fileID, setFileID] = useState('');
  const [documentID, setDocumentID] = useState('');

  // const [filesList, setFilesList] = useState(workspace && workspace.docs
  //   ? Object.keys(workspace.fileIDs).map((fileName) => ({ id: fileName, name: fileName }))
  //   : []
  // )

  // const filesList =
  //   workspace && workspace.docs
  //     ? Object.keys(workspace.fileIDs).map((docID) => ({ id: docID, name: docID }))
  //     : [];

  const [filesList, setFilesList] = useState([]);
  const[fidya,setfidya]=useState([]);
  const[nidya,setnidya]=useState([]);


//   let wsydoc,provider;
// useEffect(()=>{
//   wsydoc= new Y.Doc();
//   provider = new WebrtcProvider(id, wsydoc, {
//     signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//   });
// },[]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
    
  const wsydoc= new Y.Doc();
  const provider = new WebrtcProvider(id, wsydoc, {
    signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
  });
    // async function fetchWorkspace() {
    //   YOU CAN REUSE THE BELOW CODE TO GET WORKSPACE INFO FROM INDEX DB
    //   const workspaces = await getStoredWorkspaces();
    //   const currentWorkspace = workspaces.find((ws) => ws.id === id);
    //   if (currentWorkspace) {
    //     console.log('has current workspace');
    //     const doc = await loadDocFromWorkspace(id);
    //     const docs = currentWorkspace.fileIDs || {};
    //     const docnames = currentWorkspace.filenames || [];
    //     console.log(docs);
    //     setWorkspace({ ...currentWorkspace, docs, doc });
    //     setCurrentFile(Object.keys(docs)[0] || '');
    //     setFilesList(Object.keys(docnames).map((fileIndex => ({
    //       id: docs[fileIndex],
    //       name: docnames[fileIndex],
    //     }))));
    //   } else {
    //     setWorkspace({ docs: {} });
    //   }
    //const wsydoc = provider.get(id); // returns the Yjs doc for that workspace ID
    console.log(wsydoc);
  //   // provider = new WebrtcProvider(id, {signaling: ...}) <- `id` here is from useParams in line 23
  //   // Get the ydoc from this provider
  //  // might not be the correct syntax. Only indicative of what you need to do
    const fileIDsYArray = wsydoc.getArray('fileIDs');
    const fileNamesYArray = wsydoc.getArray('filenames');
  //   
    const writeIDBtoYarray = async(id)=>{
      const db = await getDB(id);
      const tx = db.transaction(['metadata'], 'readwrite');
      const store = tx.objectStore('metadata');
      const myworkspace = await store.get(id);
      console.log(myworkspace);
      myworkspace.fileIDs.forEach(ele => {
        fileIDsYArray.push([ele]);
      });
      myworkspace.filenames.forEach(ele => {
        fileNamesYArray.push([ele]);
      });
      await store.put(myworkspace);
      await tx.done;
    }
    
    const addws=async()=>{
      const wsid=nanoid(7);
    const db = await getDB(wsid);
    const doc = new Y.Doc();
    const tx = db.transaction(['metadata'], 'readwrite');
    const store = tx.objectStore('metadata');
    await store.put({
      id: wsid,
      username,
      fileIDs: new Y.Array(),
      fileIDdocs: [],
      filenames: new Y.Array() ,
    });
    await tx.done;
  }

    if(fileIDsYArray.length===0 && fileNamesYArray.length===0){
      writeIDBtoYarray(id);
    }
    else{
      // logic to fetch files from webRTC
      //upsert - update + insert
      //const datab=addws();
      // const tempArray = [];
      // for(let i=0;i<fileIDsYArray.length;i++){
      //   tempArray.push(
      //     {
      //       id: fileIDsYArray.get(i),
      //       name: fileNamesYArray.get(i)
      //     })
      // }
      // fileIDsYArray.forEach(ele => {
      //   datab.fileIDs.push([ele]);
      // });
      // fileNamesYArray.forEach(ele => {
      //   datab.filenames.push([ele]);
      // });
      // setfidya(fileIDsYArray);
      // setnidya(fileNamesYArray);
    }
  //   // if fileIDsYArray is empty -> push changes to y array from indexed db
  //   //
  //   //
  //   //
  //   // You know how to get workspace info from indexed db because it's implemented above
  //   //
  //   // else
  //   //
  //   // tempArray = []
  //   // for(i := 0; i < fileIDsYArray.length; i++){
  //   // tempArray.push(
  //   // {
  //   //   id: fileIDsYArray.get(i),
  //   //   name: fileNamesYArray.get(i)
  //   // })
  //   // }
  //   //
  //   //
  //   // FLOW:
  //   // If you're a person who just created the workspace, then when you connect to the provider, you won't find any y array there
  //   // so you push stuff from db on to there (which will also be empty)
  //   //
  //   // If you're a collaborator joining, then when you login to the provider (join the room), you'll find a y array set by someone else there
  //   // So you don't touch your indexed db, but fetch the fileIDs and fileNames from WebRTC
  //   // BUT, remember to put these fileIDs and fileNames in your indexed db, why?
  //   //
  //   // Because if everyone leaves the WebRTC room and comes back later, then someone should have the latest version of the saved data
  //   // It's a messy solution but you'll have the same data as the first person that joins the room
  //   // }

  //   // fetchWorkspace();
  }, [id]);
// camel-case or snake-case
  const addFile = async () => {
    if (workspace && workspace.fileIDs) {
      const fileIndex = Object.keys(workspace.fileIDs).length + 1;
      const newFileName = `untitled-${nanoid(3)}`;
      const { filename, docID } = await addFileToWorkspace(id, newFileName);
      // ADD TO YARRAY AS WELL
      fidya.push(docID);
      nidya.push(newFileName);
      const updatedWorkspace = { ...workspace, docs: { ...workspace.docs, [fileIndex]: docID } };
      setWorkspace(updatedWorkspace);
      setCurrentFile(newFileName);
      setFilesList([...filesList, { id: docID, name: newFileName }]);
    }
  };

  const handleFileDelete = async (fileName) => {
    if (workspace && Array.isArray(workspace.fileIDs)) {
      deleteFileFromWorkspace(id, fileName);
      // ALSO DELETE FROM Y ARRAY
      console.log(`hello i am ${fileName}`);
      setFilesList(filesList.filter((file) => file.id !== fileName));
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
                // workspaceID={currentWorkspace} // Uncomment and use if needed
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
