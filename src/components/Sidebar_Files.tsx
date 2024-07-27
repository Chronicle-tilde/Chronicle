/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
'use client';
import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { FolderIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Define a new context with different default values
const FilesSidebarContext = createContext({
  open: false,
  setOpen: (p0?: boolean) => {},
  animate: true,
  buttonText: 'Add File',
  onButtonClick: () => {},
});

// Custom hook to use the FilesSidebar context
export const useFilesSidebar = () => {
  const context = useContext(FilesSidebarContext);
  if (!context) {
    throw new Error('useFilesSidebar must be used within a FilesSidebarProvider');
  }
  return context;
};

// Provider component for the FilesSidebar context
export const FilesSidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  buttonText,
  onButtonClick,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <FilesSidebarContext.Provider
      value={{
        open,
        setOpen,
        animate,
        buttonText,
        onButtonClick,
      }}
    >
      {children}
    </FilesSidebarContext.Provider>
  );
};

// Desktop sidebar component for file management
export const FilesDesktopSidebar = ({ workspaces = [], onDeleteWorkspace, ...props }) => {
  const { open, animate, buttonText, onButtonClick } = useFilesSidebar();
  const safeWorkspaces = Array.isArray(workspaces) ? workspaces : [];
  return (
    <motion.div
      className='hidden h-full w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800'
      animate={{ width: animate ? (open ? '300px' : '60px') : '300px' }}
      {...props}
    >
      <div className="flex flex-col space-y-2">
        {safeWorkspaces.map((workspace) => (
          <div key={workspace.id} className="flex items-center justify-between py-2 hover:bg-gray-700 dark:hover:bg-gray-600">
            <Link
              href={`/workspace/${workspace.id}`}
              className="flex items-center gap-2"
            >
              <FolderIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              {open && <span className="text-sm text-neutral-700 dark:text-neutral-200">{workspace.name}</span>}
            </Link>
            {open && (
              <button
                onClick={() => onDeleteWorkspace(workspace.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onButtonClick}
          className="mt-4 flex items-center justify-center bg-transparent text-white p-2 rounded-full shadow-md hover:bg-[#181818] transition"
        >
          {open ? buttonText : <PlusIcon className="h-5 w-5" />}
        </button>
      </div>
    </motion.div>
  );
};

// Mobile sidebar component for file management
export const FilesMobileSidebar = ({ workspaces = [], onDeleteWorkspace, ...props }) => {
  const { open, setOpen, buttonText, onButtonClick } = useFilesSidebar();
  const safeWorkspaces = Array.isArray(workspaces) ? workspaces : [];
  return (
    <div
      className='flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 md:hidden dark:bg-neutral-800'
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900'
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            <div className="flex flex-col space-y-2">
              {safeWorkspaces.map((workspace) => (
                <div key={workspace.id} className="flex items-center justify-between py-2 hover:bg-gray-700 dark:hover:bg-gray-600">
                  <Link
                    href={`/workspace/${workspace.id}`}
                    className="flex items-center gap-2"
                  >
                    <FolderIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
                    {open && <span className="text-sm text-neutral-800 dark:text-neutral-200">{workspace.name}</span>}
                  </Link>
                  {open && (
                    <button
                      onClick={() => onDeleteWorkspace(workspace.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={onButtonClick}
                className="mt-4 flex items-center justify-center bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
              >
                {open ? buttonText : <PlusIcon className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
