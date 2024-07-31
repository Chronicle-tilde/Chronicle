import { openDB } from 'idb';
import * as Y from 'yjs';
import { nanoid } from 'nanoid';
import { WebrtcProvider } from 'y-webrtc';

const DATABASE_VERSION = 1;

const getDB = async (dbName) => {
  return openDB(dbName, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'id' });
      }
    },
  });
};


  export async function setupwsforsharing(currentWorkspace) {
    const wsDoc = new Y.Doc();
    // const docIDs = wsDoc.getArray('FileIDs');
    // const docNames = wsDoc.getArray('filenames');
      const workspaceProvider = new WebrtcProvider(currentWorkspace, wsDoc, {
        signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
      });
      return { wsDoc, workspaceProvider };
  }

const addWorkspace = async (workspaceID) => {
  const db = await getDB(workspaceID);
  const doc = new Y.Doc();
  const docID = nanoid(7);
  const yarray = doc.getArray('untitled-1.md');
  yarray.push([docID]);
  const newFileName = `untitled-1.md`;
  const tx = db.transaction(['metadata'], 'readwrite');
  const store = tx.objectStore('metadata');
  await store.put({
    id: workspaceID,
    fileIDs: [docID],
    fileIDdocs: [doc.toJSON()],
    filenames: [newFileName],
  });
  await tx.done;
  setupwsforsharing(workspaceID);
  return workspaceID;
};

const getStoredWorkspaces = async () => {
  const workspaces = [];
  const databases = await indexedDB.databases();
  for (const db of databases) {
    const dbName = db.name;
    if (dbName) {
      try {
        const dbInstance = await getDB(dbName);
        const tx = dbInstance.transaction(['metadata'], 'readonly');
        const store = tx.objectStore('metadata');
        const workspace = await store.get(dbName);
        if (workspace) {
          workspaces.push({
            id: dbName,
            username: workspace.username,
            fileIDs: workspace.fileIDs,
            fileIDdocs: workspace.fileIDdocs,
            filenames: workspace.filenames,
          });
        }
      } catch (error) {
        console.error(`Error accessing database ${dbName}:`, error);
      }
    }
  }

  return workspaces;
};

const deleteWorkspace = async (workspaceID) => {
  await indexedDB.deleteDatabase(workspaceID);
};

const addFileToWorkspace = async (workspaceID, fileName) => {
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
    workspace.fileIDs = new Y.Array();
  }
  if (!Array.isArray(workspace.fileIDdocs)) {
    workspace.fileIDdocs = new Y.Array();
  }
  workspace.fileIDs.push(docID);
  workspace.fileIDdocs.push(doc.toJSON());
  workspace.filenames.push(fileName);
  await store.put(workspace);
  await tx.done;
  return { fileName, docID };
};

const deleteFileFromWorkspace = async (workspaceID, fileID) => {
  console.log(`workspace ${workspaceID}`)
  const db = await getDB(workspaceID);
  const tx = db.transaction(['metadata'], 'readwrite');
  const store = tx.objectStore('metadata');
  const workspace = await store.get(workspaceID);
  const updatedFileIDs = workspace.fileIDs;
  const updatedFileIDdocs = workspace.fileIDdocs;
  const updatedFileNames = workspace.filenames;
  console.log(`workspace ids ${updatedFileIDs}`);
  if (workspace) {
    const fileIndex = workspace.fileIDs.indexOf(fileID);
    if (fileIndex > -1) {
      updatedFileIDs.splice(fileIndex, 1);
      updatedFileIDdocs.splice(fileIndex, 1);
      updatedFileNames.splice(fileIndex, 1);
      await store.put(workspace);
      await tx.done;
    } else {
      console.error(`File ID ${fileID} not found in workspace ${workspaceID}`);
    }
  } else {
    throw new Error(`Workspace with ID ${workspaceID} not found`);
  }
};
const loadDocFromWorkspace = async (workspaceID) => {
  const db = await getDB(workspaceID);
  const tx = db.transaction('metadata', 'readonly');
  const store = tx.objectStore('metadata');
  const workspace = await store.get(workspaceID);
  return workspace ? workspace.fileIDdocs : null;
};


export {
  getStoredWorkspaces,
  addWorkspace,
  deleteWorkspace,
  addFileToWorkspace,
  deleteFileFromWorkspace,
  loadDocFromWorkspace,
};
