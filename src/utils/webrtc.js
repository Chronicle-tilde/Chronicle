// import { useEffect, useRef } from 'react';
// import { WebrtcProvider } from 'y-webrtc';
// import * as Y from 'yjs';
// import { updateFile, getFile } from '../utils/firestore';

// export function useWebRTC(docID) {
//   const doc = useRef(new Y.Doc());
//   const provider = useRef(null);
//   const awareness = useRef(null);

//   useEffect(() => {
//     provider.current = new WebrtcProvider(docID, doc.current, {
//       signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
//     });

//     awareness.current = provider.current.awareness;

//     awareness.current.on('update', async () => {
//       const peerCount = awareness.current.getStates().size;
//       const isLastPeer = peerCount === 1;
      
//       if (isLastPeer) {
//         await pushDocumentToFirestore();
//       }

//     });

//     const handleFirstPeerJoin = async () => {
//       const peerCount = awareness.current.getStates().size;
//       if (peerCount === 1) {
//         await pullDocumentFromFirestore();
//       }
//     };

//     provider.current.on('status', (event) => {
//       if (event.status === 'connected') {
//         handleFirstPeerJoin();
//       }
//     });

//     return () => {
//       provider.current.destroy();
//     };
//   }, [listID, workspaceID]);

//   const pushDocumentToFirestore = async () => {
//     const filesArray = doc.current.getArray('files');
//     for (const file of filesArray) {
//       await updateFile(workspaceID, file.id, file.content);
//     }
//   };

//   const pullDocumentFromFirestore = async () => {
//     const files = await getFilesInWorkspace(workspaceID);
//     files.forEach((file) => {
//       doc.current.getArray('files').push([file]);
//     });
//   };

//   return doc.current;
// }



// // testtest

// // collaborativeEditor.js
// import * as Y from "yjs";
// import { WebrtcProvider } from "y-webrtc";
// import { IndexeddbPersistence } from "y-indexeddb";
// import { saveDocumentToFirestore, getDocumentFromFirestore } from "./firestoreUtils";
// import { Awareness } from "y-protocols/awareness";

// // Initialize Yjs
// const ydoc = new Y.Doc();
// const provider = new WebrtcProvider("your-room-name", ydoc);
// const persistence = new IndexeddbPersistence("your-doc-name", ydoc);
// const awareness = provider.awareness;

// // Monitor the number of peers
// awareness.on("change", async () => {
//   const states = Array.from(awareness.getStates().values());
//   const numPeers = states.length;

//   // When only one peer is online, save changes to Firestore
//   if (numPeers === 1) {
//     const content = ydoc.toJSON();
//     await saveDocumentToFirestore("your-doc-id", content);
//   }
// });

// // Fetch changes from Firestore when a peer comes online
// const syncWithFirestore = async () => {
//   const content = await getDocumentFromFirestore("your-doc-id");
//   if (content) {
//     ydoc.applyUpdate(content);
//   }
// };

// // When the peer count goes from 0 to 1
// provider.on("synced", async () => {
//   const states = Array.from(awareness.getStates().values());
//   if (states.length === 1) {
//     await syncWithFirestore();
//   }
// });
