import { useEffect, useState } from "react";
import apiClient from "../api/client";

export const useReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await apiClient.get("/reports/folders/storage");
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return { report, loading };
};
