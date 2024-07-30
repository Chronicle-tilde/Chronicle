import { openDB } from 'idb';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useParams } from 'next/navigation';

// const DATABASE_VERSION = 1;

// const getDB = async (workspaceID) => {
//   return openDB(workspaceID, DATABASE_VERSION, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains('metadata')) {
//         db.createObjectStore('metadata', { keyPath: 'id' });
//       }
//     },
//   });
// };

// const defineProvidersForDocs = (docIDs) => {
//   docIDs.forEach((docID) => {
//     const doc = new Y.Doc();
//     new WebrtcProvider(docID, doc, {
//       signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//     });
//   });
// };

// const initializeWorkspace = async (workspaceID) => {
//   const db = await getDB(workspaceID);
//   const workspaceDoc = new Y.Doc();
//   const arrayDoc = new Y.Doc();
//   const yArray = arrayDoc.getArray('fileIDs');

//   //Initialize WebRTC provider for the array document
//   new WebrtcProvider(workspaceID, arrayDoc, {
//     signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//   });

//   //Observe changes to the Yjs array and initialize providers for each document ID
//   yArray.observe(event => {
//     event.changes.added.forEach(item => {
//       const docID = item.content.getContent()[0];
//       defineProvidersForDocs([docID]);
//     });
//   });

//   // Ensure existing document IDs in the array are also initialized
//   const docIDs = yArray.toArray();
//   defineProvidersForDocs(docIDs);

//   // Store workspace metadata in the IndexedDB
  // const tx = db.transaction(['metadata'], 'readwrite');
  // const store = tx.objectStore('metadata');
//   await store.put({
//     id: workspaceID,
//     doc: Y.encodeStateAsUpdate(workspaceDoc),
//     fileIDs: yArray.toArray(),
//     ARRAYDOC: Y.encodeStateAsUpdate(arrayDoc),
//   });
//   await tx.done;
// };

// export { getDB, defineProvidersForDocs, initializeWorkspace};

// path-to-getDB.js or path-to-getDB.ts


// Function to get IndexedDB instance
export async function getDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1); // Specify version if needed

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Create WebRTC provider for real-time collaboration
function createWorkspaceProvider(workspaceID, yDoc) {
  return new WebrtcProvider(workspaceID, yDoc, {
    signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
  });
}

// currentWorkspace is 'workspace-wkdJX8d'
export async function setupwsforsharing(currentWorkspace) {
  console.log(`this is ${currentWorkspace}`);
  const wsDoc = new Y.Doc();
  const docIDs = wsDoc.getArray('FileIDs');
  const docNames = wsDoc.getArray('filenames');
    const workspaceProvider = createWorkspaceProvider(currentWorkspace, wsDoc);
    return { docIDs, wsDoc, docNames, workspaceProvider };
}
//y-text for workspace-name
//y-map key-value approach

// Add file to IndexedDB workspace
async function addFileToWorkspace(workspaceID, fileName) {
  const db = await getDB(workspaceID);
  const doc = new Y.Doc();
  const docID = nanoid(7);
  const tx = db.transaction(['metadata'], 'readwrite');
  const store = tx.objectStore('metadata');
  const workspace = await store.get(workspaceID);

  if (!workspace) {
    throw new Error(`Workspace with ID ${workspaceID} not found`);
  }
  if (!Array.isArray(workspace.fileIDs)) {
    workspace.fileIDs = [];
  }
  if (!Array.isArray(workspace.fileIDdocs)) {
    workspace.fileIDdocs = [];
  }
  if (!Array.isArray(workspace.filenames)) {
    workspace.filenames = [];
  }

  workspace.fileIDs.push(docID);
  workspace.fileIDdocs.push(doc.toJSON());
  workspace.filenames.push(fileName);

  await store.put(workspace);
  await tx.done;
  return { fileName, docID };
}

// Delete file from IndexedDB workspace
async function deleteFileFromWorkspace(workspaceID, fileID) {
  const db = await getDB(workspaceID);
  const tx = db.transaction(['metadata'], 'readwrite');
  const store = tx.objectStore('metadata');
  const workspace = await store.get(workspaceID);

  if (!workspace) {
    throw new Error(`Workspace with ID ${workspaceID} not found`);
  }

  const fileIndex = workspace.fileIDs.indexOf(fileID);
  if (fileIndex > -1) {
    workspace.fileIDs.splice(fileIndex, 1);
    workspace.fileIDdocs.splice(fileIndex, 1);
    workspace.filenames.splice(fileIndex, 1);

    await store.put(workspace);
    await tx.done;
  } else {
    console.error(`File ID ${fileID} not found in workspace ${workspaceID}`);
  }
}

// Join an existing workspace and synchronize changes
// export async function joinws(currentWorkspaceID) {
//   const { docIDs, wsDoc, docNames, workspaceProvider } = await setupws(currentWorkspaceID);

//   // Observe changes to document IDs and filenames
//   docIDs.observe(async (event) => {
//     for (const filename of event.added) {
//       await addFileToWorkspace(currentWorkspaceID, filename);
//     }

//     for (const fileID of event.deleted) {
//       await deleteFileFromWorkspace(currentWorkspaceID, fileID);
//     }
//   });

//   // Observe changes to the Yjs document for real-time updates
//   wsDoc.on('update', (update) => {
//     // Handle real-time updates if necessary
//   });
// }
