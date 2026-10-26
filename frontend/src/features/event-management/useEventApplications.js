import { useCallback, useEffect, useState } from "react";
import { getEventApplications } from "./eventApplicationsApi";

export function useEventApplications(eventId) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    if (!eventId) {
      setApplications([]);
      return;
    }
    setIsLoading(true);
    getEventApplications(eventId)
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Gagal memuat lamaran:", err);
        setError("Gagal memuat daftar lamaran.");
      })
      .finally(() => setIsLoading(false));
  }, [eventId]);

  useEffect(() => reload(), [reload]);

  return { applications, isLoading, error, reload };
}
