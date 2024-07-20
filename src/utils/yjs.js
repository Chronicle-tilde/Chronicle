// src/utils/yjs.js
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';

export function setupYjs(docID) {
  const ydoc = new Y.Doc();
  const webrtcProvider = new WebrtcProvider(docID, ydoc,{signaling:['ws://chroniclesignalling.anuragrao.me:6969']});
  const indexeddbProvider = new IndexeddbPersistence(docID, ydoc);
  indexeddbProvider.on('synced', () => {
    console.log('Content has been loaded from IndexedDB');
  });
  return { ydoc, webrtcProvider, indexeddbProvider };
}

export async function getStoredWorkspaces() {
  const ydoc = new Y.Doc();
  const indexeddbProvider = new IndexeddbPersistence('workspaces', ydoc);
  await indexeddbProvider.whenSynced;
  const workspacesArray = ydoc.getArray('workspaces');
  return workspacesArray.toArray();
}

export async function addWorkspace(workspaceID) {
  const ydoc = new Y.Doc();
  const indexeddbProvider = new IndexeddbPersistence('workspaces', ydoc);
  await indexeddbProvider.whenSynced;
  const workspacesArray = ydoc.getArray('workspaces');
  workspacesArray.push([workspaceID]);
}

export async function deleteWorkspace(workspaceID){
  const ydoc = new Y.Doc();
  const indexeddbProvider = new IndexeddbPersistence('workspaces', ydoc);
  await indexeddbProvider.whenSynced;
  const workspacesArray = ydoc.getArray('workspaces');
  const index = workspacesArray.toArray().indexOf(workspaceID);
  if (index > -1) {
    workspacesArray.delete(index, 1);
  }
  indexedDB.deleteDatabase(workspaceID); // Deleting the workspace database
}
