import React, { useEffect } from "react";
import { useFiles } from "../hooks/useFiles";
import FileListItem from "../components/FileListItem";

const Basket = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Корзина";
  }, []);

  const { files, restoreFile, deleteFilePermanently, restoreAll, clearBasket } =
    useFiles();

  const deletedFiles = files
    .filter((file) => file.isDeleted)
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
          <FileListItem
            key={file.id}
            file={file}
            restoreFile={restoreFile}
            deletePermanently={deleteFilePermanently}
          />
        ))}
      </div>
    </main>
  );
};

export default Basket;
