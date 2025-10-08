import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const addFileModalRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/files");
      setFiles(response.data.filter((file) => !file.isDeleted));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setNewFileName(file.name.split(".").slice(0, -1).join("."));
    }
  };

  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      alert("Please select a file to upload.");
      return;
    }

    const newFile = {
      id: Date.now().toString(),
      name: newFileName || fileToUpload.name,
      type: fileToUpload.name.split(".").pop(),
      size: `${(fileToUpload.size / 1024).toFixed(2)} KB`,
      path: `blob:http://localhost:5173/${self.crypto.randomUUID()}`,
      uploadDate: new Date().toISOString(),
      isStarred: false,
      isDeleted: false,
    };

    try {
      await axios.post("http://localhost:3000/files", newFile);
      fetchFiles();
      // Reset form
      setNewFileName("");
      setFileToUpload(null);
      document.getElementById("addFileForm").reset();
      const modal = Modal.getInstance(addFileModalRef.current);
      modal.hide();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  const toggleStar = async (file) => {
    try {
      const updatedFile = { ...file, isStarred: !file.isStarred };
      await axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      fetchFiles();
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const deleteFile = async (file) => {
    try {
      const updatedFile = { ...file, isDeleted: true };
      await axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-files"></i> Мои файлы
        </h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addFileModal"
        >
          <i className="bi bi-plus-lg"></i> Добавить файл
        </button>
      </div>

      <div
        className="modal fade"
        id="addFileModal"
        tabIndex="-1"
        aria-hidden="true"
        ref={addFileModalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content bg-secondary">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-cloud-arrow-up"></i> Добавить файл
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form id="addFileForm" onSubmit={handleAddFile}>
                <div className="mb-3">
                  <label htmlFor="fileName" className="form-label">
                    Имя файла
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fileUpload" className="form-label">
                    Выберите файл
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Отмена
              </button>
              <button
                type="submit"
                form="addFileForm"
                className="btn btn-primary"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {files.map((file) => (
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
                <button
                  className="btn btn-sm text-danger"
                  onClick={() => deleteFile(file)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MyFiles;
