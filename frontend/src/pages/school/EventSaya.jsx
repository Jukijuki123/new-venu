import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { LuSparkles, LuCalendarDays, LuCheck, LuFileText, LuStore } from "react-icons/lu";
import { FiInbox } from "react-icons/fi";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import EventFormModal from "../../components/event-management/EventFormModal";
import { useMyEvents } from "../../features/event-management/useMyEvents";
import { createEvent } from "../../features/event-management/eventManagementApi";

const STAT_CARDS = [
  { key: "total", label: "Total Event", icon: LuCalendarDays, iconBg: "bg-[#EFF6FF]", iconColor: "text-[#1677C8]", valueColor: "text-[#0B2340]" },
  { key: "aktif", label: "Event Aktif", icon: LuCheck, iconBg: "bg-[#ECFDF5]", iconColor: "text-[#16A34A]", valueColor: "text-[#0B2340]" },
  { key: "draft", label: "Masih Draft", icon: LuFileText, iconBg: "bg-[#FFF7ED]", iconColor: "text-[#F59E0B]", valueColor: "text-[#0B2340]" },
  { key: "booth", label: "Kapasitas Booth", icon: LuStore, iconBg: "bg-[#F5F3FF]", iconColor: "text-[#7C3AED]", valueColor: "text-[#0B2340]" },
];

const STATUS_STYLE = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  published: { label: "Aktif", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Ditutup", className: "bg-orange-50 text-orange-700" },
  completed: { label: "Selesai", className: "bg-blue-50 text-blue-700" },
};

const STATUS_FILTER = [
  { value: "", label: "Semua Event" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Aktif" },
  { value: "closed", label: "Ditutup" },
  { value: "completed", label: "Selesai" },
];

function formatDate(s) {
  if (!s) return "-";
  try {
    return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return s; }
}

export default function EventSaya() {
  const { events, isLoading, error, reload } = useMyEvents();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  const stats = useMemo(() => {
    const total = events.length;
    const aktif = events.filter((e) => e.status === "published").length;
    const draft = events.filter((e) => e.status === "draft").length;
    const booth = events.reduce((sum, e) => sum + Number(e.booth_capacity || 0), 0);
    return { total, aktif, draft, booth };
  }, [events]);

  const filtered = useMemo(() => {
    if (!filter) return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  const handleCreate = async (payload) => {
    try {
      await createEvent(payload);
      setShowForm(false);
      reload();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat event.");
    }
  };

  return (
    <div className="min-h-screen  font-sans">
      <SchoolNavbar />

      <main className="mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10">
        {/* ================= HERO ================= */}
        <section className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#475569] shadow-sm">
              <LuSparkles size={13} className="text-[#FF8A00]" />
              VENU · Event Saya
            </div>
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#0B2340] md:text-[45px]">
              Kelola setiap event, <br></br>
              <span className="text-[#1677C8]">ciptakan lebih banyak peluang.</span>
            </h1>
            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#64748B]">
              Buat event, hubungkan dengan UMKM yang paling cocok, dan tumbuhkan peluang kolaborasi bersama komunitas sekolahmu.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(22,119,200,0.25)] transition hover:bg-[#1268B2]"
              >
                <span className="text-lg leading-none">＋</span> Buat Event Baru
              </button>
              {filtered.length > 0 && (
                <Link
                  to={`/school/events/${filtered[0].id}/analytics`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#0B2340] transition hover:border-[#1677C8] hover:text-[#1677C8]"
                >
                  Lihat Analisis →
                </Link>
              )}
            </div>
          </div>

          {/* Hero illustration — flat 3D calendar */}
          <img src="/img/Event.png" alt="" />
        </section>

        {/* ================= STATS ================= */}
        <section className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-4">
          {STAT_CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.key} className="rounded-2xl border border-[#E6ECF3] bg-white p-4 shadow-sm md:p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">Live</span>
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">{c.label}</p>
                <p className={`mt-1 text-[26px] font-bold leading-none ${c.valueColor}`}>
                  {isLoading ? "—" : stats[c.key] ?? 0}
                </p>
              </div>
            );
          })}
        </section>

        {/* ================= EVENT SAYA ================= */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A00]">Event Saya</p>
              <h2 className="text-[20px] font-semibold tracking-tight text-[#0B2340] md:text-[25px]">
                Daftar event yang kamu buat
              </h2>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 rounded-full border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#0B2340] outline-none focus:border-[#1677C8]"
            >
              {STATUS_FILTER.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-[#E6ECF3] bg-white py-16 text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#1677C8]" />
              <p className="text-sm text-[#94A3B8]">Memuat event...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600">{error}</div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6FF] text-[#1677C8]">
                <LuCalendarDays size={28} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#0B2340]">Belum ada event</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-[#94A3B8]">
                Yuk, buat event pertamamu sekarang dan mulai hubungkan UMKM!
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#1268B2]"
              >
                <span className="text-lg leading-none">＋</span> Buat Event Baru
              </button>
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((event) => {
                const status = STATUS_STYLE[event.status] || STATUS_STYLE.draft;
                return (
                  <article
                    key={event.id}
                    className="group overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#1677C8] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between border-b border-[#EEF2F7] p-5">
                      <div className="min-w-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status.label}
                        </span>
                        <h3 className="mt-3 truncate text-[16px] font-bold leading-tight text-[#0B2340] group-hover:text-[#1677C8]">
                          {event.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">{event.description}</p>
                      </div>
                      <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF6FF] text-[#1677C8]">
                        <LuCalendarDays size={20} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-5 py-4 text-[11px]">
                      <Cell label="Tanggal" value={formatDate(event.event_date)} />
                      <Cell label="Lokasi" value={event.location} />
                      <Cell label="Booth" value={`${event.booth_capacity} booth`} />
                    </div>
                    <div className="flex items-center justify-between border-t border-[#EEF2F7] bg-[#F8FAFD] px-5 py-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Harga Booth</p>
                        <p className="text-sm font-bold text-[#0B2340]">
                          Rp{Number(event.booth_price || 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/school/applications?event=${event.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#1677C8] bg-[#EEF6FF] px-3 py-2 text-[11px] font-bold text-[#1677C8] transition hover:bg-[#1677C8] hover:text-white"
                        >
                          <FiInbox size={12} /> Lamaran
                        </Link>
                        <Link
                          to={`/school/events/${event.id}/tenants`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#1677C8] bg-white px-3 py-2 text-[11px] font-bold text-[#1677C8] transition hover:bg-[#1677C8] hover:text-white"
                        >
                          <LuStore size={12} /> Tenant
                        </Link>
                        <Link
                          to={`/school/events/${event.id}/analytics`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#1677C8] bg-white px-3 py-2 text-[11px] font-bold text-[#1677C8] transition hover:bg-[#1677C8] hover:text-white"
                        >
                          <LuSparkles size={12} /> Analisis
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <EventFormModal onClose={() => setShowForm(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
}

function Cell({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">{label}</p>
      <p className="mt-0.5 truncate text-[12px] font-semibold text-[#0B2340]">{value || "-"}</p>
    </div>
  );
}

function Calendar3D() {
  return (
    <svg viewBox="0 0 200 180" className="h-[180px] w-[200px]" aria-hidden>
      <defs>
        <linearGradient id="calBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="calHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1677C8" />
          <stop offset="100%" stopColor="#1268B2" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="160" rx="80" ry="12" fill="#94A3B8" opacity="0.18" />
      <rect x="34" y="34" width="132" height="120" rx="14" fill="url(#calBody)" stroke="#CBD5E1" />
      <rect x="34" y="34" width="132" height="34" rx="14" fill="url(#calHead)" />
      <rect x="34" y="60" width="132" height="2" fill="#FFFFFF" opacity="0.4" />
      <rect x="58" y="22" width="8" height="22" rx="3" fill="#0B2340" />
      <rect x="134" y="22" width="8" height="22" rx="3" fill="#0B2340" />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={44 + c * 24}
            y={82 + r * 14}
            width="18"
            height="9"
            rx="2"
            fill={(r === 2 && c === 2) ? "#FF8A00" : "#E2E8F0"}
          />
        ))
      )}
      <circle cx="100" cy="94" r="6" fill="#FFFFFF" />
      <text x="100" y="98" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0B2340">21</text>
      <path d="M 20 150 L 60 100 L 80 130 L 100 90" stroke="#FF8A00" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx="100" cy="90" r="4" fill="#FF8A00" />
    </svg>
  );
}
