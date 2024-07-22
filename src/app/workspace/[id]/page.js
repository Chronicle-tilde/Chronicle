/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '../../../components/Editor'; // Assuming Editor component exists
import Navbar from '../../../components/navbar';
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '../../../components/ui/Sidebar';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { MagnifyingGlassIcon, DocumentIcon } from '@heroicons/react/24/outline';

const Workspace = () => {
  const { id } = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [currentFile, setCurrentFile] = useState('');
  const [isRenaming, setIsRenaming] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [ydocs, setYdocs] = useState(new Map());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [availableAnimals, setAvailableAnimals] = useState([
    'Elephant',
    'Lion',
    'Tiger',
    'Zebra',
    'Panda',
    'Koala',
    'Kangaroo',
    'Giraffe',
    'Monkey',
    'Rhinoceros',
    'Cheetah',
    'Fox',
    'Wolf',
    'Bear',
    'Deer',
    'Snake',
    'Penguin',
  ]);

  useEffect(() => {
    // Fetch and set username from session storage
    const fetchUsername = () => {
      let storedUsername = sessionStorage.getItem('username');
      if (!storedUsername) {
        const randomIndex = Math.floor(Math.random() * availableAnimals.length);
        storedUsername = 'Anonymous ' + availableAnimals[randomIndex];
        sessionStorage.setItem('username', storedUsername);
        setAvailableAnimals((prevAnimals) =>
          prevAnimals.filter((animal) => animal !== availableAnimals[randomIndex])
        );
      } else {
        const animal = storedUsername.replace('Anonymous ', '');
        setAvailableAnimals((prevAnimals) =>
          prevAnimals.filter((animal) => animal !== storedUsername.replace('Anonymous ', ''))
        );
      }
      setUsername(storedUsername);
    };

    fetchUsername();
  }, [availableAnimals]);

  useEffect(() => {
    if (!id) return;

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);

    persistence.once('synced', () => {
      let workspaceData = ydoc.getMap('workspace').get('workspaceData');
      if (!workspaceData || !workspaceData.Docs) {
        workspaceData = {
          WorkspaceTitle: 'My workspace',
          Nickname: username,
          Docs: {},
        };
        ydoc.getMap('workspace').set('workspaceData', workspaceData);
      }

      setWorkspace(workspaceData);

      const filesMap = new Map();
      Object.entries(workspaceData.Docs).forEach(([docname, docID]) => {
        const doc = new Y.Doc();
        const docPersistence = new IndexeddbPersistence(docID, doc);
        filesMap.set(docname, { doc, persistence: docPersistence });
      });

      setYdocs(filesMap);
      setCurrentFile(Object.keys(workspaceData.Docs)[0] || '');
    });

    return () => {
      ydoc.destroy();
    };
  }, [id, username]);

  const addFile = () => {
    const newFileName = `untitled-${Object.keys(workspace?.Docs || {}).length + 1}.md`;
    const newDocID = `doc-${Date.now()}`;
    const newDoc = new Y.Doc();
    const newDocPersistence = new IndexeddbPersistence(newDocID, newDoc);

    const updatedDocs = { ...workspace?.Docs, [newFileName]: newDocID };
    const updatedWorkspace = { ...workspace, Docs: updatedDocs };

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);
    ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);

    persistence.once('synced', () => {
      setWorkspace(updatedWorkspace);
      setYdocs((prev) =>
        new Map(prev).set(newFileName, { doc: newDoc, persistence: newDocPersistence }),
      );
      setCurrentFile(newFileName);
    });
  };

  const handleFileNameChange = (index, oldFileName) => {
    if (newFileName.trim() && newFileName !== oldFileName) {
      const updatedDocs = { ...workspace?.Docs };
      const docID = updatedDocs[oldFileName];
      delete updatedDocs[oldFileName];
      updatedDocs[newFileName] = docID;

      const updatedWorkspace = { ...workspace, Docs: updatedDocs };
      const ydoc = new Y.Doc();
      const persistence = new IndexeddbPersistence(id, ydoc);
      ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);

      persistence.once('synced', () => {
        setWorkspace((prevWorkspace) => ({
          ...prevWorkspace,
          Docs: updatedDocs,
        }));
        setYdocs((prevYdocs) => {
          const updatedYdocs = new Map(prevYdocs);
          const fileData = updatedYdocs.get(oldFileName);
          updatedYdocs.delete(oldFileName);
          updatedYdocs.set(newFileName, fileData);
          return updatedYdocs;
        });
        setIsRenaming(null);
        setNewFileName('');
        setCurrentFile(newFileName);
      });
    }
  };

  const handleFileDelete = (fileName) => {
    const updatedDocs = { ...workspace?.Docs };
    delete updatedDocs[fileName];

    const updatedWorkspace = { ...workspace, Docs: updatedDocs };

    const ydoc = new Y.Doc();
    const persistence = new IndexeddbPersistence(id, ydoc);
    ydoc.getMap('workspace').set('workspaceData', updatedWorkspace);

    persistence.once('synced', () => {
      if (ydocs.has(fileName)) {
        ydocs.get(fileName)?.persistence.destroy();
      }

      setWorkspace(updatedWorkspace);
      setYdocs((prev) => {
        const updatedYdocs = new Map(prev);
        updatedYdocs.delete(fileName);
        return updatedYdocs;
      });

      setCurrentFile(Object.keys(updatedDocs).length > 0 ? Object.keys(updatedDocs)[0] : '');
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFiles = Array.from(ydocs.keys()).filter((fileName) =>
    fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
      <div className="flex h-screen flex-col">
        <Navbar username={username}
        />
        <div className="mt-[2rem] flex flex-1">
          <div
            className={`relative left-0 top-0 z-20 h-full transition-all duration-300 ${sidebarOpen ? 'w-32' : 'w-16'} -mt-4`}
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
          >
            <Sidebar className="flex flex-col">
              <SidebarBody className="flex-1 rounded-3xl">
                <SidebarLink
                  link={{
                    label: (
                      <a href="/workspaces" className="hover:bg-neutral-700">
                        {id}
                      </a>
                    ),
                    href: '/workspaces',
                  }}
                />
                <SidebarLink
                  link={{
                    label: (
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search files..."
                        className="mt-4 rounded-md border border-gray-600 bg-gray-800 p-2 text-white"
                      />
                    ),
                    href: '#',
                    icon: <MagnifyingGlassIcon className="h-5 w-5 text-white" />,
                  }}
                />
                <SidebarLink
                  link={{
                    label: '+ Add File',
                    href: '#',
                    onClick: addFile,
                  }}
                  className="w-4 rounded-xl hover:bg-neutral-500"
                />
                {filteredFiles.map((file) => (
                  <SidebarLink
                    key={file}
                    link={{
                      label: file,
                      href: '#',
                      icon: <DocumentIcon className="h-6 w-6 text-white" />,
                      onClick: () => setCurrentFile(file),
                    }}
                  />
                ))}
              </SidebarBody>
            </Sidebar>
          </div>
          <div
            className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-32' : 'ml-16'} -mt-5 overflow-hidden rounded-3xl border border-neutral-800 px-6 py-[-3]`}
          >
            {currentFile && ydocs.has(currentFile) ? (
              <Editor doc={ydocs.get(currentFile)?.doc} username={username} />
            ) : (
              <p className="ml-5 mt-44 text-3xl font-bold text-white">
                No file selected.
                <br />
                Please select a file from the sidebar.
              </p>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workspace;
