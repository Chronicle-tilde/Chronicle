/* eslint-disable react/prop-types */
import React from 'react';

const Sidebar = ({ files, currentFile, onFileClick, onFileNameChange, onFileDelete, onCreateFile, isRenaming, setIsRenaming, setNewFileName, newFileName }) => {
  return (
    <div className="sidebar">
      <button onClick={onCreateFile} className="workspaceButton">New File</button>
      <div className="file-tree">
        {files.map((file, index) => (
          <div key={index} className={`file-item ${file === currentFile ? 'active' : ''}`}>
            {isRenaming === index ? (
              <>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                <button onClick={() => onFileNameChange(index, file)}>Save</button>
              </>
            ) : (
              <>
                <span onClick={() => onFileClick(file)}>{file}</span>
                <button className="bg-transparent">... </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
