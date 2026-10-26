import { useCallback, useEffect, useState } from "react";
import { getUmkmMatches } from "./matchApi";

export function useUmkmMatches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setIsLoading(true);
    getUmkmMatches()
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Gagal memuat rekomendasi event:", err);
        setError("Gagal memuat rekomendasi. Coba lagi nanti.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => reload(), [reload]);

  return { matches, isLoading, error, reload };
}