import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import UmkmNavbar from "../../components/layout/UmkmNavbar";
import ProfileCard from "../../components/common/profile/ProfileCard";
import ProfileEditForm from "../../components/common/profile/ProfileEditForm";
import { FiEdit2, FiShield, FiMail, FiPhone, FiMapPin, FiDollarSign, FiTarget, FiUser, FiCheckCircle, FiTag, FiPackage, FiLoader, FiFileText } from "react-icons/fi";
import { LuStore, LuWallet, LuUsers } from "react-icons/lu";
import { getUmkmProfile, updateUmkmProfile } from "../../features/profile/umkmProfileApi";
import { useUmkmApplications } from "../../features/umkm/useUmkmApplications";

const LOCATIONS = ["Jakarta Timur", "Jakarta Selatan", "Jakarta Barat", "Jakarta Pusat", "Jakarta Utara", "Bogor", "Depok", "Tangerang", "Bekasi"];
const TARGET_OPTIONS = [
  { value: "", label: "— Belum dipilih" },
  { value: "pelajar", label: "Pelajar" },
  { value: "remaja", label: "Remaja" },
  { value: "umum", label: "Umum" },
  { value: "keluarga", label: "Keluarga" },
];
const CATEGORY_OPTIONS = [
  { value: "Fashion", label: "Fashion" },
  { value: "Aksesoris", label: "Aksesoris" },
  { value: "Kerajinan", label: "Kerajinan" },
  { value: "Makanan", label: "Makanan" },
  { value: "Minuman", label: "Minuman" },
];

const UMKM_FIELDS = [
  { key: "business_name", label: "Nama Bisnis", icon: LuStore, required: true, type: "text" },
  { key: "category", label: "Kategori", icon: FiTag, required: true, type: "select", options: CATEGORY_OPTIONS },
  { key: "products", label: "Produk", icon: FiPackage, required: false, type: "text", placeholder: "Contoh: Kopi susu, risol mayo" },
  { key: "phone", label: "No. Telepon", icon: FiPhone, required: false, type: "text" },
  { key: "location", label: "Lokasi Usaha", icon: FiMapPin, required: false, type: "select", options: [{ value: "", label: "— Pilih lokasi" }, ...LOCATIONS.map((l) => ({ value: l, label: l }))], hint: "untuk AI Match" },
  { key: "target_audience", label: "Target Pasar", icon: LuUsers, required: false, type: "select", options: TARGET_OPTIONS, hint: "untuk AI Match" },
  { key: "price_min", label: "Harga Minimum", icon: FiDollarSign, required: false, type: "number", placeholder: "15000" },
  { key: "price_max", label: "Harga Maksimum", icon: FiDollarSign, required: false, type: "number", placeholder: "50000" },
  { key: "booth_budget_max", label: "Budget Booth Max", icon: LuWallet, required: false, type: "number", placeholder: "500000", hint: "bobot 20% AI Match" },
  { key: "description", label: "Deskripsi Usaha", icon: FiFileText, required: false, type: "textarea", rows: 4, maxLength: 1000, placeholder: "Ceritakan usaha kamu, ciri khas produk..." },
];

export default function UmkmProfile() {
  const { user } = useAuth();
  const { applications } = useUmkmApplications();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(a => a.status === "approved").length;
  const attendedEvents = new Set(applications.filter(a => a.status === "approved").map(a => a.event_id)).size;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUmkmProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load umkm profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    setMessage(null);
    try {
      await updateUmkmProfile(data);
      const updated = await getUmkmProfile();
      setProfile(updated);
      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(", ") || "Gagal menyimpan.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#111827]">
        <UmkmNavbar />
        <main className="relative mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-12">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <FiLoader className="mx-auto mb-4 h-8 w-8 animate-spin text-[#1677C8]" />
            <p className="text-sm text-[#9CA3AF]">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  const displayData = { ...user, ...profile };

  // completeness untuk hint
  const aiFields = ["location", "target_audience", "booth_budget_max", "description"];
  const filled = aiFields.filter((k) => profile?.[k] != null && String(profile[k]).trim() !== "").length;
  const completeness = Math.round((filled / aiFields.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827]">
      <UmkmNavbar />

      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B2340] via-[#0B2340] to-[#1677C8]">
        <div className="pointer-events-none absolute right-0 top-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 p-8">
            {Array.from({ length: 72 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-end md:gap-8">
            <div className="group relative mb-6 md:mb-0">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-white/30 bg-gradient-to-br from-[#EEF6FF] to-[#DBEAFE] shadow-2xl">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <LuStore className="h-12 w-12 text-[#1677C8]" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1677C8] shadow-lg">
                  <LuStore className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                <FiShield size={11} />
                Akun UMKM
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                {displayData?.business_name || user?.name || "Memuat..."}
              </h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 md:justify-start">
                <span className="flex items-center gap-1.5">
                  <FiMail size={13} /> {user?.email}
                </span>
                {displayData?.location && <span className="flex items-center gap-1.5"><FiMapPin size={13} /> {displayData.location}</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="group mt-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0B2340] shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl md:mt-0"
            >
              <FiEdit2 size={15} className="transition-transform group-hover:rotate-12" />
              Edit Profil
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" className="w-full" fill="none">
              <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32C672 34 768 38 864 40C960 42 1056 42 1152 38C1248 34 1344 26 1392 22L1440 18V60H0Z" fill="#FAFAF9" />
            </svg>
          </div>
        </div>
      </div>

      <main className="relative mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-12">
        {!isEditing && completeness < 100 && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#E6ECF3] bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-[#0B2340]">Lengkapi profil untuk AI Match</p>
              <p className="text-xs text-[#64748B]">{filled}/{aiFields.length} field penting terisi — isinya biar skor kamu tinggi di pencarian School.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-[#1677C8]">{completeness}%</span>
              <button onClick={() => setIsEditing(true)} className="rounded-full bg-[#0B2340] px-4 py-2 text-xs font-bold text-white hover:bg-[#123A6B]">Lengkapi</button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" && <FiCheckCircle size={18} />}
            {message.text}
          </div>
        )}

        {isEditing && (
          <ProfileEditForm
            title="Edit Profil UMKM"
            fields={UMKM_FIELDS}
            apiFetch={getUmkmProfile}
            apiSave={updateUmkmProfile}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {!isEditing && (
          <>
            <section className="mb-8 grid grid-cols-3 gap-3">
              <ProfileStat label="Total Lamaran" value={totalApplications} accent="#1677C8" />
              <ProfileStat label="Diterima" value={acceptedApplications} accent="#16A34A" />
              <ProfileStat label="Event Diikuti" value={attendedEvents} accent="#7C3AED" />
            </section>

            <ProfileCard
              title="Informasi Bisnis"
              icon={LuStore}
              iconBg="bg-[#EFF6FF]"
              iconColor="text-[#1677C8]"
              fields={UMKM_FIELDS}
              data={displayData}
              onEdit={() => setIsEditing(true)}
            />

            <div className="mt-5">
              <ProfileCard
                title="Informasi Akun"
                icon={FiShield}
                iconBg="bg-[#F5F3FF]"
                iconColor="text-[#7C3AED]"
                fields={[
                  { key: "role", label: "Role", icon: FiUser },
                  { key: "email", label: "Email", icon: FiMail },
                ]}
                data={user}
                readonly
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ProfileStat({ label, value, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-2xl font-extrabold tracking-[-1px] text-[#111827]">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-[#9CA3AF]">{label}</p>
      <div className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: accent }} />
    </div>
  );
}
