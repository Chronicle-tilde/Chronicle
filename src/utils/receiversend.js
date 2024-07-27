// import { openDB } from 'idb';
// import * as Y from 'yjs';
// import { WebrtcProvider } from 'y-webrtc';

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
//   new WebrtcProvider(workspaceID, arrayDoc, {
//     signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//   });
//   const docIDs = yArray.toArray();
//   docIDs.forEach((docID) => {
//     const doc = new Y.Doc();
//     new WebrtcProvider(docID, doc, {
//       signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//     });
//   });
//   const tx = db.transaction(['metadata'], 'readwrite');
//   const store = tx.objectStore('metadata');
//   console.log({
//     id: workspaceID,
//     doc: Y.encodeStateAsUpdate(workspaceDoc),
//     fileIDs: yArray.toArray(),
//     ARRAYDOC: Y.encodeStateAsUpdate(arrayDoc),
//   });
//   await store.put({
//     id: workspaceID,
//     doc: Y.encodeStateAsUpdate(workspaceDoc),
//     fileIDs: yArray.toArray(),
//     ARRAYDOC: Y.encodeStateAsUpdate(arrayDoc),
//   });
//   await tx.done;
// };

// export { getDB, defineProvidersForDocs, initializeWorkspace };
