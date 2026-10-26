import { useEffect, useState, useCallback } from "react";
import { getUmkmApplications } from "./umkmApplicationsApi";

export function useUmkmApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUmkmApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat lamaran.");
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { applications, isLoading, error, reload };
}
