import React, { useState, useEffect } from "react";
import axios from "axios";

const Starred = () => {
  const [starredFiles, setStarredFiles] = useState([]);

  useEffect(() => {
    fetchStarredFiles();
  }, []);

  const fetchStarredFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/files");
      setStarredFiles(
        response.data.filter((file) => file.isStarred && !file.isDeleted)
      );
    } catch (error) {
      console.error("Error fetching starred files:", error);
    }
  };

  const toggleStar = async (file) => {
    try {
      const updatedFile = { ...file, isStarred: !file.isStarred };
      await axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      fetchStarredFiles();
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  return (
    <main className="container my-5">
      <h2 className="mb-4">
        <i className="bi bi-star-fill text-warning"></i> Избранное
      </h2>

      <div className="alert alert-info bg-secondary border-info">
        <i className="bi bi-info-circle"></i> Здесь отображаются файлы,
        добавленные в избранное
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {starredFiles.map((file) => (
          <div key={file.id} className="col">
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
                      className={`bi ${
                        file.isStarred ? "bi-star-fill" : "bi-star"
                      }`}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Starred;
