import { useEffect, useState, useCallback } from "react";
import { getEvents } from "./eventApi";

export function useEvents(fetchParams = {}) {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramKey = JSON.stringify(fetchParams);

  const reload = useCallback(async (overrideParams) => {
    const p = overrideParams ?? fetchParams;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getEvents(p);
      const raw = res?.data ?? res;
      const list = Array.isArray(raw) ? raw : raw?.data ?? [];
      setEvents(Array.isArray(list) ? list : []);
      if (raw?.meta) setPagination({ meta: raw.meta, links: raw.links });
      else setPagination(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat event.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [paramKey]);

  useEffect(() => {
    reload();
  }, [reload, paramKey]);

  return { events, pagination, isLoading, error, reload };
}

