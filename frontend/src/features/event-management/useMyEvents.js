import { useCallback, useEffect, useState } from "react";
import { getMyEvents } from "./eventManagementApi";

export function useMyEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setIsLoading(true);
    getMyEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Gagal memuat event:", err);
        setError("Gagal memuat daftar event.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => reload(), [reload]);

  return { events, isLoading, error, reload };
}