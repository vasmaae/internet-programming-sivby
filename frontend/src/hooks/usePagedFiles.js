import { useEffect, useState } from "react";
import apiClient from "../api/client";

const emptyPage = {
  content: [],
  page: 0,
  size: 6,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export const usePagedFiles = ({ status, searchQuery, folderId = "" }) => {
  const [pageData, setPageData] = useState(emptyPage);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadFiles = async (nextPage = page) => {
    setLoading(true);

    try {
      const response = await apiClient.get("/files", {
        params: {
          page: nextPage,
          size: 6,
          status,
          search: searchQuery || undefined,
          folderId: folderId || undefined,
        },
      });
      setPageData(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [status, searchQuery, folderId]);

  useEffect(() => {
    loadFiles(page);
  }, [page, status, searchQuery, folderId]);

  const saveFile = async (payload, id) => {
    const method = id ? "put" : "post";
    const url = id ? `/files/${id}` : "/files";

    await apiClient[method](url, payload);
    await loadFiles(page);
  };

  const removeFile = async (id) => {
    await apiClient.delete(`/files/${id}`);
    await loadFiles(page);
  };

  const downloadFile = async (file) => {
    const response = await apiClient.get(`/files/${file.id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name}.${file.extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    pageData,
    loading,
    page,
    setPage,
    createFile: (payload) => saveFile(payload),
    updateFile: (id, payload) => saveFile(payload, id),
    deleteFilePermanently: removeFile,
    downloadFile,
    reload: () => loadFiles(page),
  };
};
