import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-tutup toast setelah 4 detik
  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleGoogleLoginClick = () => {
    setToast({
      show: true,
      message:
        "Mohon maaf, login menggunakan akun Google belum tersedia saat ini. Silakan masuk menggunakan email dan kata sandi yang sudah terdaftar.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user } = response.data.data;

      login(user);

      if (user.role === "school") {
        navigate("/school", { replace: true });
      } else if (user.role === "umkm") {
        navigate("/umkm", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
      } else {
        setError("Koneksi ke server gagal. Pastikan backend sudah menyala.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-navy">Bergabung dengan VENU</h1>
        <p className="mt-2 text-sm text-navy/50">Silakan masukkan akun Anda untuk melanjutkan</p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Masukkan e-mail Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-full border border-navy/20 px-5 py-3 text-sm focus:border-navy focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-navy">
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="Masukkan kata sandi Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-full border border-navy/20 px-5 py-3 text-sm focus:border-navy focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-medium text-navy/70 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-navy/20 text-navy focus:ring-navy"
            />
            Ingatkan Saya
          </label>
          <Link to="/forgot-password" className="font-semibold text-navy hover:text-accent">
            Lupa kata sandi?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center rounded-full bg-navy text-white hover:bg-navy-light py-3 font-bold"
          disabled={loading}
        >
          {loading ? "Sedang Masuk..." : "Masuk"}
        </Button>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy/10" />
          </div>
          <span className="relative bg-white px-4 text-xs font-semibold text-navy/40 uppercase">
            atau masuk dengan
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLoginClick}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-surface-muted border border-navy/5 py-3 text-sm font-semibold text-navy hover:bg-navy/5 transition"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.5z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.45c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.39 7.1C.5 8.9 0 10.9 0 13s.5 4.1 1.39 5.9l3.85-2.99s0 0 0-.46z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.9 1.08-3.34 0-5.86-2.19-6.76-4.51L.79 16.8c1.98 3.91 5.96 6.2 10.21 6.2z"
            />
          </svg>
          Masuk dengan Google
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-navy/70">
        Belum punya akun?{" "}
        <Link to="/register" className="font-bold text-navy hover:text-accent">
          Daftar sekarang.
        </Link>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </AuthLayout>
  );
}