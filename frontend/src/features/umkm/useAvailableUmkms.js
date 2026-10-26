import { useEffect, useState } from "react";
import { getUmkms } from "./umkmApi";

export function useAvailableUmkms(limit = 3) {
    const [umkms, setUmkms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);

        getUmkms({ limit })
            .then((response) => {
                if (!isMounted) return;

                const data = response?.data ?? response;

                setUmkms(
                    Array.isArray(data)
                        ? data
                        : []
                );
            })
            .catch((error) => {
                if (!isMounted) return;

                console.error(
                    "Gagal memuat UMKM:",
                    error
                );

                setUmkms([]);
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
        umkms,
        isLoading,
    };
}