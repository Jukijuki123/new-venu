import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import ProfileCard from "../../components/common/profile/ProfileCard";
import ProfileEditForm from "../../components/common/profile/ProfileEditForm";
import { FiEdit2, FiShield, FiMail, FiPhone, FiMapPin, FiBriefcase, FiUser, FiCheckCircle, FiLoader } from "react-icons/fi";
import { LuGraduationCap, LuIdCard } from "react-icons/lu";
import { getSchoolProfile, updateSchoolProfile } from "../../features/profile/schoolProfileApi";
import { useMyEvents } from "../../features/event-management/useMyEvents";

const SCHOOL_FIELDS = [
  { key: "school_name", label: "Nama Sekolah", icon: LuGraduationCap, required: true },
  { key: "npsn", label: "NPSN", icon: LuIdCard, required: false },
  { key: "position", label: "Jabatan", icon: FiBriefcase, required: false },
  { key: "email", label: "Email", icon: FiMail, required: true },
  { key: "phone", label: "No. Telepon", icon: FiPhone, required: false },
  { key: "address", label: "Alamat", icon: FiMapPin, required: false },
];

export default function SchoolProfile() {
  const { user } = useAuth();
  const { events } = useMyEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stats from events
  const totalEvent = events?.length || 0;
  const eventAktif = events?.filter(e => e.status === "published").length || 0;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getSchoolProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load school profile:", err);
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
      await updateSchoolProfile(data);
      const updated = await getSchoolProfile();
      setProfile(updated);
      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#111827]">
        <SchoolNavbar />
        <main className="relative mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-12">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <FiLoader className="mx-auto mb-4 h-8 w-8 animate-spin text-[#1677C8]" />
            <p className="text-sm text-[#9CA3AF]">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  // Merge user + profile for display
  const displayData = { ...user, ...profile };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827]">
      <SchoolNavbar />

      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B2340] via-[#0B2340] to-[#1677C8]">
        {/* Decorative dots */}
        <div className="pointer-events-none absolute right-0 top-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 p-8">
            {Array.from({ length: 72 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="relative mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-end md:gap-8">
            {/* Avatar */}
            <div className="group relative mb-6 md:mb-0">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-white/30 bg-gradient-to-br from-[#EEF6FF] to-[#DBEAFE] shadow-2xl">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FiUser className="h-12 w-12 text-[#1677C8]" />
                    </div>
                  )}
                </div>
                {/* Badge */}
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1677C8] shadow-lg">
                  <LuGraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                <FiShield size={11} />
                Akun Sekolah
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                {user?.name || "Memuat..."}
              </h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 md:justify-start">
                <span className="flex items-center gap-1.5">
                  <FiMail size={13} /> {user?.email}
                </span>
              </div>
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="group mt-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0B2340] shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl md:mt-0"
            >
              <FiEdit2 size={15} className="transition-transform group-hover:rotate-12" />
              Edit Profil
            </button>
          </div>

          {/* Bottom wave */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" className="w-full" fill="none">
              <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32C672 34 768 38 864 40C960 42 1056 42 1152 38C1248 34 1344 26 1392 22L1440 18V60H0Z" fill="#FAFAF9" />
            </svg>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-12">

        {/* Success / Error message */}
        {message && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" && <FiCheckCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <ProfileEditForm
            title="Edit Profil Sekolah"
            fields={SCHOOL_FIELDS}
            apiFetch={getSchoolProfile}
            apiSave={updateSchoolProfile}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            formatValue={(key, value) => value || ""}
          />
        )}

        {/* Profile Cards */}
        {!isEditing && (
          <>
            {/* Stats */}
            <section className="mb-8 grid grid-cols-3 gap-3">
              <ProfileStat label="Total Event" value={totalEvent} accent="#1677C8" />
              <ProfileStat label="Event Aktif" value={eventAktif} accent="#16A34A" />
              <ProfileStat label="Kapasitas Booth" value={events?.reduce((sum, e) => sum + Number(e.booth_capacity || 0), 0) || 0} accent="#7C3AED" />
            </section>

            {/* Info cards */}
            <ProfileCard
              title="Informasi Sekolah"
              icon={LuGraduationCap}
              iconBg="bg-[#EFF6FF]"
              iconColor="text-[#1677C8]"
              fields={SCHOOL_FIELDS}
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
