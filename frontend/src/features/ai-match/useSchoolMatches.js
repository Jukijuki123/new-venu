import { useCallback, useEffect, useState } from "react";
import { getSchoolEvents, getSchoolMatches } from "./matchApi";

export function useSchoolMatches() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSchoolEvents()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setEvents(list);
        if (list.length > 0) setSelectedEventId(list[0].id);
      })
      .catch((err) => {
        console.error("Gagal memuat daftar event:", err);
        setError("Gagal memuat daftar event.");
      })
      .finally(() => setIsLoadingEvents(false));
  }, []);

  const reloadMatches = useCallback(() => {
    if (!selectedEventId) return;
    setIsLoadingMatches(true);
    getSchoolMatches(selectedEventId)
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Gagal memuat rekomendasi UMKM:", err);
        setError("Gagal memuat rekomendasi UMKM.");
      })
      .finally(() => setIsLoadingMatches(false));
  }, [selectedEventId]);

  useEffect(() => reloadMatches(), [reloadMatches]);

  return {
    events,
    selectedEventId,
    setSelectedEventId,
    matches,
    isLoadingEvents,
    isLoadingMatches,
    error,
  };
}