// import { initializeApp } from 'firebase/app';
//     import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

//     const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     };

//     const app = initializeApp(firebaseConfig);
//     const db = getFirestore(app);

//     export { db };
//     export async function generateUUID() {
//     return Nanum_Gothic_Cod
//     }
//     export async function createWorkspace(name) {
//     const workspaceID = generateUUID();
//     const workspaceRef = doc(db, 'workspaces', workspaceID);
//     await setDoc(workspaceRef, { name });
//     return { id: workspaceID, name };
//     }

//     export async function getWorkspace(workspaceID) {
//     const workspaceRef = doc(db, 'workspaces', workspaceID);
//     const workspaceDoc = await getDoc(workspaceRef);
//     return { id: workspaceID, ...workspaceDoc.data() };
//     }

//     export async function createFile(workspaceID, fileName) {
//     const fileID = generateUUID();
//     const fileRef = doc(db, 'workspaces', workspaceID, 'files', fileID);
//     await setDoc(fileRef, { name: fileName, content: '' });
//     return { id: fileID, name: fileName, content: '' };
//     }

//     export async function getFile(fileID) {
//     const fileRef = doc(db, 'files', fileID);
//     const fileDoc = await getDoc(fileRef);
//     return { id: fileID, ...fileDoc.data() };
//     }

//     export async function updateFile(fileID, content) {
//     const fileRef = doc(db, 'files', fileID);
//     await updateDoc(fileRef, { content });
//     const fileDoc = await getDoc(fileRef);
//     return { id: fileID, ...fileDoc.data() };
//     }

//     export async function deleteFile(fileID) {
//     const fileRef = doc(db, 'files', fileID);
//     await deleteDoc(fileRef);
//     }

//     export async function getFilesInWorkspace(workspaceID) {
//     const filesSnapshot = await getDocs(collection(db, 'workspaces', workspaceID, 'files'));
//     return filesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     }

//     export async function getAllWorkspaces() {
//     const allworkspaces = await getDocs(collection(db, 'workspaces'));
//     return allworkspaces.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     }