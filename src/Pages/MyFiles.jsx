import React, { useState, useRef, useEffect } from "react";
import { useFiles } from "../hooks/useFiles";
import FileCard from "../components/FileCard";
import { Modal } from "bootstrap";

const MyFiles = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Мои файлы";
  }, []);

  const { files: allFiles, addFile, toggleStar, deleteFile } = useFiles();
  const [newFileName, setNewFileName] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const addFileModalRef = useRef(null);

  const files = allFiles
    .filter((file) => !file.isDeleted)
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    addFile(newFile);

    // Reset form
    setNewFileName("");
    setFileToUpload(null);
    document.getElementById("addFileForm").reset();
    const modal = Modal.getInstance(addFileModalRef.current);
    modal.hide();
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
          <FileCard
            key={file.id}
            file={file}
            toggleStar={toggleStar}
            deleteFile={deleteFile}
          />
        ))}
      </div>
    </main>
  );
};

export default MyFiles;
