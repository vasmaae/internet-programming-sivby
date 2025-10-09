import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useFiles = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const addFile = async (newFile) => {
    try {
      await axios.post("http://localhost:3000/files", newFile);
      fetchFiles();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  const updateFile = async (updatedFile) => {
    try {
      await axios.put(
        `http://localhost:3000/files/${updatedFile.id}`,
        updatedFile
      );
      fetchFiles();
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const deleteFilePermanently = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/files/${id}`);
      fetchFiles();
    } catch (error) {
      console.error("Error permanently deleting file:", error);
    }
  };

  const toggleStar = (file) => {
    updateFile({ ...file, isStarred: !file.isStarred });
  };

  const deleteFile = (file) => {
    updateFile({ ...file, isDeleted: true });
  };

  const restoreFile = (file) => {
    updateFile({ ...file, isDeleted: false });
  };

  const restoreAll = async () => {
    try {
      const deletedFiles = files.filter((file) => file.isDeleted);
      const promises = deletedFiles.map((file) => {
        const updatedFile = { ...file, isDeleted: false };
        return axios.put(`http://localhost:3000/files/${file.id}`, updatedFile);
      });
      await Promise.all(promises);
      fetchFiles();
    } catch (error) {
      console.error("Error restoring all files:", error);
    }
  };

  const clearBasket = async () => {
    try {
      const deletedFiles = files.filter((file) => file.isDeleted);
      const promises = deletedFiles.map((file) =>
        axios.delete(`http://localhost:3000/files/${file.id}`)
      );
      await Promise.all(promises);
      fetchFiles();
    } catch (error) {
      console.error("Error clearing basket:", error);
    }
  };

  return {
    files,
    addFile,
    toggleStar,
    deleteFile,
    restoreFile,
    deleteFilePermanently,
    restoreAll,
    clearBasket,
  };
};
