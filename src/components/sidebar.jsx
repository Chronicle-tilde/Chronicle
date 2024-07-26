/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({
  files,
  currentFile,
  onFileClick,
  onCreateFile,
  isRenaming,
  setIsRenaming,
  onFileNameChange,
  newFileName,
  setNewFileName,
  onFileDelete,
}) => {
  const router = useRouter();

  return (
    <div className="sidebar">
      <button
        onClick={() => router.push('/')}
        className="btn btn-secondary"
      >
        Back to Workspaces
      </button>
      <div className="file-tree">
        {files.map((file) => (
          <div
            key={file}
            className={`file-item ${currentFile === file ? 'active' : ''}`}
            onClick={() => onFileClick(file)}
          >
            {file}
          </div>
        ))}
        <button
          onClick={onCreateFile}
          className="btn btn-primary"
        >
          Add File
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
