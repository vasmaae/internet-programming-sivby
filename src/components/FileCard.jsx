import React from "react";

const FileCard = ({ file, toggleStar, deleteFile }) => {
  return (
    <div className="col">
      <div className="card h-100 file-card d-flex flex-column">
        <div className="card-body flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title text-truncate">{file.name}</h5>
            <button
              className={`btn btn-sm ${
                file.isStarred ? "text-warning" : "text-light"
              }`}
              onClick={() => toggleStar(file)}
            >
              <i
                className={`bi ${file.isStarred ? "bi-star-fill" : "bi-star"}`}
              ></i>
            </button>
          </div>
          <p className="card-text text-muted">
            {file.size} - {new Date(file.uploadDate).toLocaleDateString()}
          </p>
        </div>
        <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2 file-actions">
          <button className="btn btn-sm text-light">
            <i className="bi bi-download"></i>
          </button>
          {deleteFile && (
            <button
              className="btn btn-sm text-danger"
              onClick={() => deleteFile(file)}
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
