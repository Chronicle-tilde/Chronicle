import React, { useState } from 'react';

const Sidebar = ({
  files,
  currentFile,
  onFileClick,
  onFileNameChange,
  onFileDelete,
  onCreateFile,
  isRenaming,
  setIsRenaming,
  setNewFileName,
  newFileName,
}) => {
  const [openOptionsIndex, setOpenOptionsIndex] = useState(null);

  const handleOptionsClick = (index) => {
    setOpenOptionsIndex(openOptionsIndex === index ? null : index);
  };

  const handleFileNameChange = (index, file) => {
    onFileNameChange(index, file);
    setOpenOptionsIndex(null); // Close the options menu
  };

  const handleFileDelete = (file) => {
    onFileDelete(file);
    setOpenOptionsIndex(null); // Close the options menu
  };

  const crabby = () => {
    onCreateFile();
    setOpenOptionsIndex(null);
  };

  return (
    <div className="sidebar mt-10 relative">
      <button onClick={crabby} className="bg-[#181818] text-[#ff9f00] hover:bg-[#292929]">
        Add File
      </button>
      <div className="file-tree">
        {files.map((file, index) => (
          <div key={index} className={`file-item ${file === currentFile ? 'active' : ''} flex items-center relative`}>
            {isRenaming === index ? (
              <>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="bg-[#181818] text-[#ff9f00] border border-[#ff9f00] rounded px-2"
                />
                <button
                  onClick={() => handleFileNameChange(index, file)}
                  className="bg-[#181818] text-[#ff9f00] hover:bg-[#292929] ml-2"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span onClick={() => onFileClick(file)} className="flex-grow">{file}</span>
                <div className="relative inline-block">
                  <button
                    onClick={() => handleOptionsClick(index)}
                    className="text-[#ff9f00] ml-2 bg-[#181818] hover:bg-[#292929]"
                  >
                    ...
                  </button>
                  {openOptionsIndex === index && (
                    <div className="absolute bg-[#181818] text-[#ff9f00] rounded p-1 w-32 top-0 left-full ml-2 z-10">
                      <button
                        onClick={() => setIsRenaming(index)}
                        className="block hover:bg-[#292929] w-3/5 text-center px-2 py-1"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleFileDelete(file)}
                        className="block hover:bg-[#292929] w-3/5 text-center px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;


