import axios from "axios";

// Di dev gunakan "/api/v1" agar lewat Vite proxy (same-origin).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Origin endpoint CSRF Sanctum. Kosong = same-origin (Vite proxy / production).
const SANCTUM_BASE_URL = import.meta.env.VITE_SANCTUM_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

let csrfRequest = null;

/**
 * Ambil cookie XSRF-TOKEN dari Sanctum.
 * Dipanggil otomatis sebelum request non-GET dan saat token kedaluwarsa (419).
 */
export function ensureCsrfCookie(force = false) {
  if (!csrfRequest || force) {
    csrfRequest = axios
      .get(`${SANCTUM_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
      .catch((error) => {
        csrfRequest = null;
        throw error;
      });
  }

  return csrfRequest;
}

/** Buang cache token CSRF (mis. setelah logout, token lama tidak berlaku). */
export function resetCsrfCookie() {
  csrfRequest = null;
}

// Pastikan CSRF cookie tersedia sebelum request yang mengubah data.
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toUpperCase();
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);

  if (isMutation) {
    await ensureCsrfCookie();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config;

    // CSRF token tidak cocok/kedaluwarsa: ambil ulang lalu ulangi sekali.
    if (status === 419 && config && !config._csrfRetried) {
      config._csrfRetried = true;
      await ensureCsrfCookie(true);
      return api.request(config);
    }

    // Session habis: arahkan ke login, kecuali untuk pengecekan sesi awal.
    const isSessionCheck = (config?.url || "").includes("/auth/me");
    if (status === 401 && !isSessionCheck) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
