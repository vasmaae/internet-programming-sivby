import React, { useEffect, useState } from "react";
import { usePagedFiles } from "../hooks/usePagedFiles";
import { useFolders } from "../hooks/useFolders";
import FileCard from "../components/FileCard";
import Pagination from "../components/Pagination";

const MyFiles = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Мои файлы";
  }, []);

  const [folderId, setFolderId] = useState("");
  const [createFolderId, setCreateFolderId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const { folders } = useFolders();
  const {
    pageData,
    loading,
    page,
    setPage,
    createFile,
    updateFile,
    downloadFile,
  } = usePagedFiles({ status: "ACTIVE", searchQuery, folderId });

  const currentFolderId = Number(createFolderId || folders[0]?.id || 1);

  const handleAddFile = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Сначала выбери файл для загрузки.");
      return;
    }

    const base64Content = await readFileAsBase64(selectedFile);
    const parsed = parseFileName(selectedFile.name);

    await createFile({
      name: parsed.name,
      extension: parsed.extension,
      sizeBytes: Number(selectedFile.size),
      storagePath: `/virtual-storage/${selectedFile.name}`,
      mimeType: selectedFile.type || "application/octet-stream",
      base64Content,
      folderId: currentFolderId,
      starred: false,
      deleted: false,
    });

    setSelectedFile(null);
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-files"></i> Мои файлы
        </h2>
        <span className="badge text-bg-info">
          Всего файлов: {pageData.totalElements}
        </span>
      </div>

      <div className="card bg-secondary border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleAddFile}>
            <div className="col-md-4">
              <label className="form-label">Файл</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Имя</label>
              <input
                type="text"
                className="form-control"
                value={selectedFile ? parseFileName(selectedFile.name).name : ""}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Расширение</label>
              <input
                type="text"
                className="form-control"
                value={
                  selectedFile ? parseFileName(selectedFile.name).extension : ""
                }
                readOnly
              />
            </div>
            <div className="col-md-1">
              <label className="form-label">Байт</label>
              <input
                type="text"
                className="form-control"
                value={selectedFile ? selectedFile.size : ""}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Папка</label>
              <select
                className="form-select"
                value={createFolderId}
                onChange={(e) => setCreateFolderId(e.target.value)}
              >
                <option value="">Первая доступная папка</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          </form>
          {uploadError && (
            <div className="alert alert-warning mt-3 mb-0">{uploadError}</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <select
          className="form-select w-auto"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
        >
          <option value="">Все папки</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="alert alert-info">Загрузка файлов...</div>}

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
            onMoveToBasket={(currentFile) =>
              updateFile(currentFile.id, {
                name: currentFile.name,
                extension: currentFile.extension,
                sizeBytes: currentFile.sizeBytes,
                storagePath: currentFile.storagePath,
                mimeType: currentFile.mimeType,
                folderId: currentFile.folderId,
                starred: currentFile.starred,
                deleted: true,
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

const parseFileName = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex <= 0) {
    return { name: fileName, extension: "bin" };
  }

  return {
    name: fileName.slice(0, lastDotIndex),
    extension: fileName.slice(lastDotIndex + 1),
  };
};

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default MyFiles;
