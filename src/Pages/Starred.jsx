import React, { useEffect } from "react";
import { useFiles } from "../hooks/useFiles";
import FileCard from "../components/FileCard";

const Starred = ({ searchQuery }) => {
  useEffect(() => {
    document.title = "DISCOver - Избранное";
  }, []);

  const { files, toggleStar } = useFiles();

  const starredFiles = files
    .filter((file) => file.isStarred && !file.isDeleted)
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
          <FileCard key={file.id} file={file} toggleStar={toggleStar} />
        ))}
      </div>
    </main>
  );
};

export default Starred;
