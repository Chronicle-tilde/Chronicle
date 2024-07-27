// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { openDB } from 'idb';
// import * as Y from 'yjs';
// import { WebrtcProvider } from 'y-webrtc';
// import { nanoid } from 'nanoid';

// const DATABASE_VERSION = 1;

// const getDB = async (dbName) => {
//   return openDB(dbName, DATABASE_VERSION, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains('metadata')) {
//         db.createObjectStore('metadata', { keyPath: 'id' });
//       }
//     },
//   });
// };

// const addWorkspace = async (workspaceID, username) => {
//   // const workspaceID = `workspace-${nanoid(7)}`;
//   const db = await getDB(workspaceID);
//   const doc = new Y.Doc();
//   const docID = `file-${nanoid(7)}`;
//   const yarray = doc.getArray('untitled-1.md');
//   yarray.push([docID]);
//   const arraydoc = new Y.Doc();
//   arraydoc.getArray('files').push([
//     { content: 'Welcome to your new workspace!', id: workspaceID },
//   ]);
//   await updateWorkspaceArrayDoc(workspaceID, [docID]);
//   // const provider = new WebrtcProvider(workspaceID, doc, {
//   //   signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//   // });
//   const tx = db.transaction(['metadata'], 'readwrite');
//   const store = tx.objectStore('metadata');
//   await store.put({
//     id: workspaceID,
//     username,
//     doc: doc.toJSON(),
//     fileIDs: yarray.toArray(),
//     ARRAYDOC: arraydoc.toJSON(),
//   });
//   await tx.done;
//   return workspaceID;
// };

// const getStoredWorkspaces = async () => {
//   const workspaces = [];

//   const databases = await indexedDB.databases();
//   for (const db of databases) {
//     const dbName = db.name;

//     if (dbName) {
//       try {
//         const dbInstance = await getDB(dbName);
//         const tx = dbInstance.transaction(['metadata'], 'readonly');
//         const store = tx.objectStore('metadata');
//         const workspace = await store.get(dbName);

//         if (workspace) {
//           workspaces.push({
//             id: dbName,
//             username: workspace.username,
//             docs: workspace.doc,
//             fileIDs: workspace.fileIDs,
//           });
//         }
//       } catch (error) {
//         console.error(`Error accessing database ${dbName}:`, error);
//       }
//     }
//   }

//   return workspaces;
// };

// const deleteWorkspace = async (workspaceID) => {
//   await indexedDB.deleteDatabase(workspaceID);
// };

// const updateWorkspaceArrayDoc = async (workspaceID, fileIDs) => {
//   const db = await getDB(workspaceID);
//   const arraydoc = new Y.Doc();
//   const filesArray = arraydoc.getArray('files');

//   if (!Array.isArray(fileIDs)) {
//     console.error('fileIDs is not an array:', fileIDs);
//     return;
//   }

//   fileIDs.forEach((id, index) => {
//     filesArray.push([{ content: `Content of file ${index + 1}`, id }]);
//   });

//   const tx = db.transaction(['metadata'], 'readwrite');
//   const store = tx.objectStore('metadata');
//   const workspace = await store.get(workspaceID);

//   if (workspace) {
//     workspace.ARRAYDOC = arraydoc.toJSON();
//     await store.put(workspace);
//   }

//   await tx.done;
// };

// const addFileToWorkspace = async (workspaceID, fileName) => {
//   const db = await getDB(workspaceID);

//   const doc = new Y.Doc();
//   const yarray = doc.getArray('fileIDs');
//   const docID = nanoid(7);
//   yarray.push([docID]);

//   const provider = new WebrtcProvider(docID, doc, {
//     signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//   });

//   const tx = db.transaction(['metadata'], 'readwrite');
//   const store = tx.objectStore('metadata');
//   const workspace = await store.get(workspaceID);

//   if (!workspace) {
//     throw new Error(`Workspace with ID ${workspaceID} not found`);
//   }

//   if (!Array.isArray(workspace.fileIDs)) {
//     workspace.fileIDs = [];
//   }

//   workspace.fileIDs.push(docID);
//   await store.put(workspace);
//   await tx.done;

//   await updateWorkspaceArrayDoc(workspaceID, workspace.fileIDs);

//   return { fileName, docID };
// };

// const deleteFileFromWorkspace = async (workspaceID, fileName) => {
//   const db = await getDB(workspaceID);
//   const tx = db.transaction(['metadata'], 'readwrite');
//   const store = tx.objectStore('metadata');
//   const workspace = await store.get(workspaceID);

//   if (workspace) {
//     if (workspace.fileIDs[fileName] !== undefined) {
//       delete workspace.fileIDs[fileName];
//       await store.put(workspace);
//       await tx.done;
//       await updateWorkspaceArrayDoc(workspaceID, workspace.fileIDs);
//     } else {
//       console.error(`File ${fileName} not found in workspace ${workspaceID}`);
//     }
//   } else {
//     throw new Error(`Workspace with ID ${workspaceID} not found`);
//   }
// };




// const loadDocFromWorkspace = async (workspaceID) => {
//   const db = await getDB(workspaceID);
//   const tx = db.transaction('metadata', 'readonly');
//   const store = tx.objectStore('metadata');
//   const workspace = await store.get(workspaceID);
//   return workspace ? workspace.doc : null;
// };

// export {
//   getStoredWorkspaces,
//   addWorkspace,
//   deleteWorkspace,
//   addFileToWorkspace,
//   deleteFileFromWorkspace,
//   loadDocFromWorkspace,
// };