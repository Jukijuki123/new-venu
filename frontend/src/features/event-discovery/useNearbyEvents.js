import { useEffect, useState } from "react";
import { getEvents } from "./eventApi";

export function useNearbyEvents(limit = 3) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    getEvents({ limit })
      .then((response) => {
        if (!isMounted) return;

        const eventData = response?.data ?? response;

        setEvents(
          Array.isArray(eventData)
            ? eventData
            : []
        );
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(
          "Gagal memuat event terdekat:",
          error
        );

        setEvents([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return {
    events,
    isLoading,
  };
}