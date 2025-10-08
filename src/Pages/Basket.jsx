import React, { useState, useEffect } from "react";
import axios from "axios";

const Basket = () => {
  const [deletedFiles, setDeletedFiles] = useState([]);

  useEffect(() => {
    fetchDeletedFiles();
  }, []);

  const fetchDeletedFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/files");
      setDeletedFiles(response.data.filter((file) => file.isDeleted));
    } catch (error) {
      console.error("Error fetching deleted files:", error);
    }
  };

  const restoreFile = async (file) => {
    try {
      const updatedFile = { ...file, isDeleted: false };
      await axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      fetchDeletedFiles();
    } catch (error) {
      console.error("Error restoring file:", error);
    }
  };

  const deletePermanently = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/files/${id}`);
      fetchDeletedFiles();
    } catch (error) {
      console.error("Error permanently deleting file:", error);
    }
  };

  const restoreAll = async () => {
    try {
      const promises = deletedFiles.map((file) => {
        const updatedFile = { ...file, isDeleted: false };
        return axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      });
      await Promise.all(promises);
      fetchDeletedFiles();
    } catch (error) {
      console.error("Error restoring all files:", error);
    }
  };

  const clearBasket = async () => {
    try {
      const promises = deletedFiles.map((file) =>
        axios.delete(`http://localhost:3000/files/${file.id}`)
      );
      await Promise.all(promises);
      fetchDeletedFiles();
    } catch (error) {
      console.error("Error clearing basket:", error);
    }
  };

  return (
    <main className="container my-5">
      <h2 className="mb-4">
        <i className="bi bi-trash-fill text-danger"></i> Корзина
      </h2>

      <div className="alert alert-warning bg-secondary border-warning">
        <i className="bi bi-exclamation-triangle"></i> Файлы будут автоматически
        удалены через 30 дней
      </div>

      <div className="d-flex gap-3 mb-4">
        <button
          className="btn btn-danger"
          onClick={clearBasket}
          disabled={deletedFiles.length === 0}
        >
          <i className="bi bi-trash"></i> Очистить корзину
        </button>
        <button
          className="btn btn-success"
          onClick={restoreAll}
          disabled={deletedFiles.length === 0}
        >
          <i className="bi bi-arrow-counterclockwise"></i> Восстановить все
        </button>
      </div>

      <div className="list-group">
        {deletedFiles.map((file) => (
          <div
            key={file.id}
            className="list-group-item list-group-item-action bg-secondary text-light border-dark d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{file.name}</h5>
              <small>
                {file.size} - Удален:{" "}
                {new Date(file.uploadDate).toLocaleDateString()}
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
        ))}
      </div>
    </main>
  );
};

export default Basket;
