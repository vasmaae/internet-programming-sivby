import React from "react";

const FileListItem = ({ file, restoreFile, deletePermanently }) => {
  return (
    <div className="list-group-item list-group-item-action bg-secondary text-light border-dark d-flex justify-content-between align-items-center">
      <div>
        <h5 className="mb-1">{file.name}</h5>
        <small>
          {file.size} - Удален: {new Date(file.uploadDate).toLocaleDateString()}
        </small>
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => restoreFile(file)}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => deletePermanently(file.id)}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
