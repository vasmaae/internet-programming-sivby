import React from "react";
import { formatBytes, formatDate } from "../utils/format";

const FileCard = ({
  file,
  onToggleStar,
  onMoveToBasket,
  onRestore,
  onDownload,
}) => {
  return (
    <div className="col">
      <div className="card h-100 file-card d-flex flex-column">
        <div className="card-body flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title text-truncate">{file.name}</h5>
            <button
              className={`btn btn-sm ${
                file.starred ? "text-warning" : "text-light"
              }`}
              onClick={() => onToggleStar?.(file)}
            >
              <i
                className={`bi ${file.starred ? "bi-star-fill" : "bi-star"}`}
              ></i>
            </button>
          </div>
          <p className="card-text text-muted">
            {file.folderName}
          </p>
          <p className="card-text text-muted">
            {formatBytes(file.sizeBytes)} - {formatDate(file.uploadedAt)}
          </p>
        </div>
        <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2 file-actions">
          {file.hasContent && (
            <button className="btn btn-sm text-light" onClick={() => onDownload?.(file)}>
              <i className="bi bi-download"></i>
            </button>
          )}
          {onMoveToBasket && (
            <button
              className="btn btn-sm text-danger"
              onClick={() => onMoveToBasket(file)}
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
          {onRestore && (
            <button className="btn btn-sm text-success" onClick={() => onRestore(file)}>
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
