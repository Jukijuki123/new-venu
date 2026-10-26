import { useEffect, useState } from "react";
import { getUmkms } from "./umkmApi";

export function useAvailableUmkms(limit = 3) {
    const [umkms, setUmkms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getUmkms({ limit })
            .then((res) => {
                if (isMounted) setUmkms(res.data ?? res);
            })
            .catch((err) => console.error("Gagal memuat UMKM:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [limit]);

    return { umkms, isLoading };
}