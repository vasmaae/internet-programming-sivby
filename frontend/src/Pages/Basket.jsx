import React, { useEffect } from "react";
import { usePagedFiles } from "../hooks/usePagedFiles";
import FileListItem from "../components/FileListItem";
import Pagination from "../components/Pagination";

const Basket = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Корзина";
  }, []);

  const { pageData, loading, page, setPage, updateFile, deleteFilePermanently } =
    usePagedFiles({
      status: "DELETED",
      searchQuery,
    });

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
          onClick={async () => {
            await Promise.all(
              pageData.content.map((file) => deleteFilePermanently(file.id))
            );
          }}
          disabled={pageData.content.length === 0}
        >
          <i className="bi bi-trash"></i> Очистить корзину
        </button>
        <button
          className="btn btn-success"
          onClick={async () => {
            await Promise.all(
              pageData.content.map((file) =>
                updateFile(file.id, {
                  name: file.name,
                  extension: file.extension,
                  sizeBytes: file.sizeBytes,
                  storagePath: file.storagePath,
                  mimeType: file.mimeType,
                  folderId: file.folderId,
                  starred: file.starred,
                  deleted: false,
                })
              )
            );
          }}
          disabled={pageData.content.length === 0}
        >
          <i className="bi bi-arrow-counterclockwise"></i> Восстановить все
        </button>
      </div>

      {loading && <div className="alert alert-info">Загрузка корзины...</div>}

      <div className="list-group">
        {pageData.content.map((file) => (
          <FileListItem
            key={file.id}
            file={file}
            restoreFile={(currentFile) =>
              updateFile(currentFile.id, {
                name: currentFile.name,
                extension: currentFile.extension,
                sizeBytes: currentFile.sizeBytes,
                storagePath: currentFile.storagePath,
                mimeType: currentFile.mimeType,
                folderId: currentFile.folderId,
                starred: currentFile.starred,
                deleted: false,
              })
            }
            deletePermanently={deleteFilePermanently}
          />
        ))}
      </div>

      <Pagination pageData={pageData} page={page} setPage={setPage} />
    </main>
  );
};

export default Basket;
