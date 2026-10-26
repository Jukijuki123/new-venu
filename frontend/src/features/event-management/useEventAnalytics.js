import { useCallback, useEffect, useState } from "react";
import { getEventAnalytics } from "./eventAnalyticsApi";

export function useEventAnalytics(eventId) {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    if (!eventId) {
      setAnalytics(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    getEventAnalytics(eventId)
      .then((data) => {
        setAnalytics(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat analytics:", err);
        setError(
          err.response?.data?.message ||
          "Gagal memuat analisis event."
        );
        setIsLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { analytics, isLoading, error, reload };
}
