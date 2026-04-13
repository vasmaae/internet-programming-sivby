import React, { useEffect } from "react";
import { usePagedFiles } from "../hooks/usePagedFiles";
import FileCard from "../components/FileCard";
import Pagination from "../components/Pagination";

const Starred = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Избранное";
  }, []);

  const { pageData, loading, page, setPage, updateFile, downloadFile } = usePagedFiles({
    status: "STARRED",
    searchQuery,
  });

  return (
    <main className="container my-5">
      <h2 className="mb-4">
        <i className="bi bi-star-fill text-warning"></i> Избранное
      </h2>

      <div className="alert alert-info bg-secondary border-info">
        <i className="bi bi-info-circle"></i> Здесь отображаются файлы,
        добавленные в избранное
      </div>

      {loading && <div className="alert alert-info">Загрузка избранного...</div>}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {pageData.content.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onToggleStar={(currentFile) =>
              updateFile(currentFile.id, {
                name: currentFile.name,
                extension: currentFile.extension,
                sizeBytes: currentFile.sizeBytes,
                storagePath: currentFile.storagePath,
                mimeType: currentFile.mimeType,
                folderId: currentFile.folderId,
                starred: !currentFile.starred,
                deleted: currentFile.deleted,
              })
            }
            onDownload={downloadFile}
          />
        ))}
      </div>

      <Pagination pageData={pageData} page={page} setPage={setPage} />
    </main>
  );
};

export default Starred;
