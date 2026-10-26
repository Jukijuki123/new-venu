import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import { Landmark, Store, Check } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1); // Step 1: Pilih Role, Step 2: Form
  const [role, setRole] = useState(""); // "school" atau "umkm"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states untuk School
  const [schoolName, setSchoolName] = useState("");
  const [npsn, setNpsn] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPosition, setSchoolPosition] = useState("");
  const [schoolPassword, setSchoolPassword] = useState("");

  // Form states untuk UMKM
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [products, setProducts] = useState("");
  const [umkmPhone, setUmkmPhone] = useState("");
  const [umkmEmail, setUmkmEmail] = useState("");
  const [umkmPassword, setUmkmPassword] = useState("");
  // Field AI Match — biar muncul bagus di School
  const [umkmLocation, setUmkmLocation] = useState("");
  const [umkmTargetAudience, setUmkmTargetAudience] = useState("");
  const [umkmPriceMin, setUmkmPriceMin] = useState("");
  const [umkmPriceMax, setUmkmPriceMax] = useState("");
  const [umkmBoothBudget, setUmkmBoothBudget] = useState("");
  const [umkmDescription, setUmkmDescription] = useState("");

  const UMKM_LOCATIONS = ["Jakarta Timur", "Jakarta Selatan", "Jakarta Barat", "Jakarta Pusat", "Jakarta Utara", "Bogor", "Depok", "Tangerang", "Bekasi"];
  const UMKM_TARGETS = [
    { value: "", label: "Pilih target pasar" },
    { value: "pelajar", label: "Pelajar" },
    { value: "remaja", label: "Remaja" },
    { value: "umum", label: "Umum" },
    { value: "keluarga", label: "Keluarga" },
  ];

  const handleNextStep = () => {
    if (!role) {
      setError("Silakan pilih peran Anda terlebih dahulu.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = role === "school"
      ? {
        role,
        school_name: schoolName,
        npsn,
        email: schoolEmail,
        phone: schoolPhone,
        address: schoolAddress,
        position: schoolPosition,
        password: schoolPassword,
      }
      : {
        role,
        business_name: businessName,
        category,
        products: products || null,
        phone: umkmPhone || null,
        email: umkmEmail,
        password: umkmPassword,
        location: umkmLocation || null,
        target_audience: umkmTargetAudience || null,
        price_min: umkmPriceMin ? Number(umkmPriceMin.replace(/\D/g, "")) : null,
        price_max: umkmPriceMax ? Number(umkmPriceMax.replace(/\D/g, "")) : null,
        booth_budget_max: umkmBoothBudget ? Number(umkmBoothBudget.replace(/\D/g, "")) : null,
        description: umkmDescription?.trim() || null,
      };

    try {
      const response = await api.post("/auth/register", payload);
      // Format respon dari AuthController:
      // success: true, data: { user: { ... } } (sesi disimpan di cookie HttpOnly)
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
        setError(err.response.data.message || "Registrasi gagal. Cek kembali form Anda.");
      } else {
        setError("Koneksi gagal. Pastikan backend server Anda berjalan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* STEP 1: PILIH ROLE */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-navy">Bergabung dengan VENU</h1>
            <p className="mt-2 text-sm text-navy/50">Sebagai apa kamu ingin memulai?</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* Cards Pilihan Role */}
          <div className="grid grid-cols-2 gap-4">
            {/* Peran Sekolah */}
            <div
              onClick={() => setRole("school")}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 text-center cursor-pointer transition
                ${role === "school"
                  ? "border-accent bg-accent/5"
                  : "border-navy/10 bg-white hover:border-navy/30"
                }`}
            >
              {/* Radio checkmark di pojok kanan atas */}
              <div
                className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border
                  ${role === "school"
                    ? "border-accent bg-accent text-white"
                    : "border-navy/20 bg-white"
                  }`}
              >
                {role === "school" && <Check size={14} />}
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/5 text-navy">
                <Landmark size={32} />
              </div>
              <h2 className="mt-4 font-bold text-navy">Sekolah</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-navy/50">
                Kelola event, cari UMKM, dan pantau performa event
              </p>
            </div>

            {/* Peran UMKM */}
            <div
              onClick={() => setRole("umkm")}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 text-center cursor-pointer transition
                ${role === "umkm"
                  ? "border-accent bg-accent/5"
                  : "border-navy/10 bg-white hover:border-navy/30"
                }`}
            >
              {/* Radio checkmark di pojok kanan atas */}
              <div
                className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border
                  ${role === "umkm"
                    ? "border-accent bg-accent text-white"
                    : "border-navy/20 bg-white"
                  }`}
              >
                {role === "umkm" && <Check size={14} />}
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/5 text-navy">
                <Store size={32} />
              </div>
              <h2 className="mt-4 font-bold text-navy">UMKM</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-navy/50">
                Temukan event sekolah dan daftarkan usaha Anda
              </p>
            </div>
          </div>

          <Button
            onClick={handleNextStep}
            variant="accent"
            className="w-full py-3 font-bold justify-center"
          >
            Lanjut
          </Button>

          <div className="text-center text-sm text-navy/70">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="font-bold text-navy hover:text-accent">
              Masuk.
            </Link>
          </div>
        </div>
      )}

      {/* STEP 2: FORM REGISTRASI */}
      {step === 2 && (
        <div className="relative flex">


          <div className="w-full pl-4">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-navy">Bergabung dengan VENU</h1>
              <p className="mt-2 text-sm text-navy/50">
                {role === "school"
                  ? "Daftarkan sekolah Anda menjadi bagian dari VENU"
                  : "Daftarkan usaha Anda menjadi bagian dari VENU"}
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              {/* FORM SEKOLAH */}
              {role === "school" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">NPSN</label>
                      <input
                        type="text"
                        required
                        placeholder="NPSN Sekolah"
                        value={npsn}
                        onChange={(e) => setNpsn(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Sekolah</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Sekolah"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">E-mail</label>
                      <input
                        type="email"
                        required
                        placeholder="E-mail Sekolah"
                        value={schoolEmail}
                        onChange={(e) => setSchoolEmail(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Kontak</label>
                      <input
                        type="text"
                        required
                        placeholder="Kontak Sekolah"
                        value={schoolPhone}
                        onChange={(e) => setSchoolPhone(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Alamat</label>
                    <input
                      type="text"
                      required
                      placeholder="Alamat Sekolah"
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                      className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Peran/Jabatan</label>
                    <input
                      type="text"
                      required
                      placeholder="Sebagai apa Anda?"
                      value={schoolPosition}
                      onChange={(e) => setSchoolPosition(e.target.value)}
                      className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Kata Sandi</label>
                    <input
                      type="password"
                      required
                      placeholder="Kata Sandi"
                      value={schoolPassword}
                      onChange={(e) => setSchoolPassword(e.target.value)}
                      className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FORM UMKM */}
              {role === "umkm" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">Nama Usaha</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Bisnis Anda"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Jenis</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none bg-white"
                      >
                        <option value="Fashion">Fashion</option>
                        <option value="Aksesoris">Aksesoris</option>
                        <option value="Kerajinan">Kerajinan</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">Produk</label>
                      <input
                        type="text"
                        required
                        placeholder="Produk Usaha"
                        value={products}
                        onChange={(e) => setProducts(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Kontak</label>
                      <input
                        type="text"
                        required
                        placeholder="No Handphone"
                        value={umkmPhone}
                        onChange={(e) => setUmkmPhone(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="Alamat e-mail aktif"
                      value={umkmEmail}
                      onChange={(e) => setUmkmEmail(e.target.value)}
                      className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Kata Sandi</label>
                    <input
                      type="password"
                      required
                      placeholder="Kata Sandi"
                      value={umkmPassword}
                      onChange={(e) => setUmkmPassword(e.target.value)}
                      className="mt-1 w-full rounded-full border border-navy/10 px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">Lokasi Usaha</label>
                      <select
                        value={umkmLocation}
                        onChange={(e) => setUmkmLocation(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      >
                        <option value="">Pilih lokasi</option>
                        {UMKM_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Target Pasar</label>
                      <select
                        value={umkmTargetAudience}
                        onChange={(e) => setUmkmTargetAudience(e.target.value)}
                        className="mt-1 w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      >
                        {UMKM_TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-navy">Harga Minimum (Rp)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="15000"
                        value={umkmPriceMin}
                        onChange={(e) => setUmkmPriceMin(e.target.value.replace(/\D/g, ""))}
                        className="mt-1 w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-navy">Harga Maksimum (Rp)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="50000"
                        value={umkmPriceMax}
                        onChange={(e) => setUmkmPriceMax(e.target.value.replace(/\D/g, ""))}
                        className="mt-1 w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Budget Maksimal Booth</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="500000"
                      value={umkmBoothBudget}
                      onChange={(e) => setUmkmBoothBudget(e.target.value.replace(/\D/g, ""))}
                      className="mt-1 w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-xs focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy">Deskripsi Usaha</label>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      placeholder="Ceritakan usaha kamu..."
                      value={umkmDescription}
                      onChange={(e) => setUmkmDescription(e.target.value)}
                      className="mt-1 w-full resize-none rounded-2xl border border-navy/10 bg-white px-4 py-2.5 text-xs leading-5 focus:border-navy focus:outline-none"
                    />
                    <p className="mt-1 text-right text-[11px] text-[#94A3B8]">{umkmDescription.length}/1000</p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full py-3 font-bold justify-center mt-6"
                disabled={loading}
              >
                {loading ? "Mendaftarkan..." : "Daftar"}
              </Button>
            </form>

            <button
              onClick={() => {
                setStep(1);
                setError("");
              }}
              className="mt-4 text-xs font-semibold text-navy/50 hover:text-navy underline block text-center w-full"
            >
              Kembali ke Pemilihan Peran
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
