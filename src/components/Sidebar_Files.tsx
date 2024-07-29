/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
'use client';
import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { DocumentIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MdDriveFileRenameOutline } from 'react-icons/md';

// Define the context with default values
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
  buttonText = 'Add File',
  onButtonClick = () => {},
}) => {
  const [openState, setOpenState] = useState(openProp || false);

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

/// Desktop sidebar component for file management
// sidebar_files.jsx
export const FilesDesktopSidebar = ({ files = [], onDeleteFile, onCurrentFileClick, ...props }) => {
  const { open, animate, buttonText, onButtonClick } = useFilesSidebar();
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <motion.div
      className="hidden h-full w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800"
      animate={{ width: animate ? (open ? '300px' : '60px') : '300px' }}
      {...props}
    >
      <div className="flex flex-col space-y-2">
        {safeFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between py-2 hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            <a onClick={() => onCurrentFileClick(file.name)} className="flex items-center gap-2">
              <DocumentIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              {open && (
                <span className="text-sm text-neutral-700 dark:text-neutral-200">{file.name}</span>
              )}
            </a>
            {open && (
              <>
                <button className="mr-auto w-auto bg-transparent text-white hover:bg-transparent">
                  <MdDriveFileRenameOutline className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteFile(file.id)}
                  className="bg-transparent text-red-500 hover:bg-neutral-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        ))}
        <button
          onClick={onButtonClick}
          className="mt-4 flex items-center justify-center rounded-full bg-transparent p-2 text-white shadow-md transition hover:bg-[#181818]"
        >
          {open ? buttonText : <PlusIcon className="h-5 w-5" />}
        </button>
      </div>
    </motion.div>
  );
};

// Mobile sidebar component for file management
// sidebar_files.jsx
export const FilesMobileSidebar = ({ files = [], onDeleteFile, onCurrentFileClick, ...props }) => {
  const { open, setOpen, buttonText, onButtonClick } = useFilesSidebar();
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div
      className="flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 md:hidden dark:bg-neutral-800"
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
            className="fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900"
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            <div className="flex flex-col space-y-2">
              {safeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between py-2 hover:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <a
                    onClick={() => onCurrentFileClick(file.name)}
                    className="flex items-center gap-2"
                  >
                    <DocumentIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
                    {open && (
                      <span className="text-sm text-neutral-800 dark:text-neutral-200">
                        {file.name}
                      </span>
                    )}
                  </a>
                  {open && (
                    <>
                      <button className="mr-auto w-auto bg-transparent text-white hover:bg-transparent">
                        <MdDriveFileRenameOutline className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="bg-transparent text-red-500 hover:bg-neutral-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              <button
                onClick={onButtonClick}
                className="mt-4 flex items-center justify-center rounded-full bg-blue-500 p-2 text-white shadow-md transition hover:bg-blue-600"
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
