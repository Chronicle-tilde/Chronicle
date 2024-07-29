import { openDB } from 'idb';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

const DATABASE_VERSION = 1;

const getDB = async (workspaceID) => {
  return openDB(workspaceID, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'id' });
      }
    },
  });
};

const defineProvidersForDocs = (docIDs) => {
  docIDs.forEach((docID) => {
    const doc = new Y.Doc();
    new WebrtcProvider(docID, doc, {
      signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
    });
  });
};

const initializeWorkspace = async (workspaceID) => {
  const db = await getDB(workspaceID);
  const workspaceDoc = new Y.Doc();
  const arrayDoc = new Y.Doc();
  const yArray = arrayDoc.getArray('fileIDs');

  // Initialize WebRTC provider for the array document
  new WebrtcProvider(workspaceID, arrayDoc, {
    signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
  });

  // Observe changes to the Yjs array and initialize providers for each document ID
  yArray.observe(event => {
    event.changes.added.forEach(item => {
      const docID = item.content.getContent()[0];
      defineProvidersForDocs([docID]);
    });
  });

  // Ensure existing document IDs in the array are also initialized
  const docIDs = yArray.toArray();
  defineProvidersForDocs(docIDs);

  // Store workspace metadata in the IndexedDB
  const tx = db.transaction(['metadata'], 'readwrite');
  const store = tx.objectStore('metadata');
  await store.put({
    id: workspaceID,
    doc: Y.encodeStateAsUpdate(workspaceDoc),
    fileIDs: yArray.toArray(),
    ARRAYDOC: Y.encodeStateAsUpdate(arrayDoc),
  });
  await tx.done;
};

export { getDB, defineProvidersForDocs, initializeWorkspace};