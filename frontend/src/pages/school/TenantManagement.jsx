import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiSearch,
  FiCheck,
  FiClock,
  FiX,
  FiUser,
  FiArrowRight,
  FiPlus,
  FiDownload,
  FiSend,
  FiUpload,
  FiGrid,
  FiInbox,
} from "react-icons/fi";
import { LuStore, LuUsers, LuInbox, LuMegaphone, LuLayoutGrid } from "react-icons/lu";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import { useMyEvents } from "../../features/event-management/useMyEvents";
import { useEventApplications } from "../../features/event-management/useEventApplications";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", className: "bg-amber-50 text-amber-700 border-amber-200", icon: FiClock, dot: "bg-amber-500" },
  approved: { label: "Aktif", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: FiCheck, dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", className: "bg-red-50 text-red-700 border-red-200", icon: FiX, dot: "bg-red-500" },
};

function formatDate(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return s; }
}

function formatRupiah(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

export default function TenantManagement() {
  const { eventId } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { events, isLoading: eventsLoading } = useMyEvents();
  const { applications, isLoading: appsLoading } = useEventApplications(eventId);

  const event = useMemo(
    () => events.find((e) => String(e.id) === String(eventId)),
    [events, eventId]
  );

  // Stats
  const stats = useMemo(() => {
    const all = applications;
    const total = all.length;
    const aktif = all.filter((a) => a.status === "approved").length;
    const pengajuan = all.filter((a) => a.status === "pending").length;
    const ditolak = all.filter((a) => a.status === "rejected").length;
    return { total, aktif, pengajuan, ditolak };
  }, [applications]);

  // Filtered applications
  const filtered = useMemo(() => {
    let result = applications;
    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.umkm?.business_name?.toLowerCase().includes(q) ||
          a.umkm?.category?.toLowerCase().includes(q) ||
          a.booth?.booth_number?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [applications, search, statusFilter]);

  const boothCapacity = Number(event?.booth_capacity || 0);
  const boothFilled = stats.aktif;
  const boothEmpty = Math.max(boothCapacity - boothFilled, 0);
  const boothPercent = boothCapacity > 0 ? Math.round((boothFilled / boothCapacity) * 100) : 0;

  // Loading state
  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:py-14">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#1677C8]" />
            <p className="text-sm text-[#9CA3AF]">Memuat data event...</p>
          </div>
        </main>
      </div>
    );
  }

  // Event tidak ditemukan
  if (!event) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:py-14">
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAFAF9]">
              <LuInbox className="h-8 w-8 text-[#D1D5DB]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Event tidak ditemukan</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Event ini mungkin sudah dihapus.</p>
            <Link
              to="/school/events"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1268B2]"
            >
              <FiArrowLeft size={16} />
              Kembali ke Event Saya
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <SchoolNavbar />

      <main className="mx-auto max-w-[1280px] px-5 py-6 md:px-8 md:py-10">

        {/* ================= TOP BAR ================= */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/school/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1677C8] transition hover:gap-2.5"
          >
            <FiArrowLeft size={16} />
            Kembali ke Detail Event
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#1677C8]" />
            <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">
              {event.name}
            </span>
          </div>
        </div>

        {/* ================= PAGE TITLE ================= */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-[-1px] text-[#111827] md:text-5xl">
            Tenant Management
          </h1>
          <p className="mt-3 text-lg text-[#6B7280]">
            Kelola UMKM yang berpartisipasi dalam <span className="font-semibold text-[#1677C8]">{event.name}</span>
          </p>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: main content */}
          <div className="min-w-0">
            {/* ================= STAT CARDS ================= */}
            <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <StatCard label="Total Tenant" value={stats.total} icon={LuUsers} iconBg="bg-[#EFF6FF]" iconColor="text-[#1677C8]" accent="#1677C8" />
              <StatCard label="Tenant Aktif" value={stats.aktif} icon={FiCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600" accent="#16A34A" />
              <StatCard label="Menunggu" value={stats.pengajuan} icon={FiClock} iconBg="bg-amber-50" iconColor="text-amber-600" accent="#F59E0B" />
              <StatCard label="Ditolak" value={stats.ditolak} icon={FiX} iconBg="bg-red-50" iconColor="text-red-500" accent="#EF4444" />
            </section>

            {/* ================= SEARCH & FILTER ================= */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                <input
                  type="text"
                  placeholder="Cari tenant, kategori, atau booth..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition focus:border-[#1677C8] focus:ring-2 focus:ring-[#1677C8]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[42px] rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#1677C8] focus:ring-2 focus:ring-[#1677C8]/10"
              >
                <option value="">Semua Status</option>
                <option value="approved">Aktif</option>
                <option value="pending">Menunggu</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              {/* Table header - desktop only */}
              <div className="hidden md:grid grid-cols-[50px_1.6fr_1fr_100px_120px_130px] border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">No</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">Nama Tenant</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">Kategori</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">Booth</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">Status</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7280]">Bergabung</div>
              </div>

              {/* Loading */}
              {appsLoading && (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#1677C8]" />
                  <p className="text-xs text-[#9CA3AF]">Memuat tenant...</p>
                </div>
              )}

              {/* Empty */}
              {!appsLoading && filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAFAF9]">
                    <LuInbox className="h-7 w-7 text-[#D1D5DB]" />
                  </div>
                  <p className="text-sm font-semibold text-[#374151]">
                    {search || statusFilter ? "Tidak ada hasil" : "Belum ada tenant"}
                  </p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    {search || statusFilter ? "Coba ubah filter pencarian" : "Tenant akan muncul setelah ada lamaran"}
                  </p>
                </div>
              )}

              {/* Rows */}
              {!appsLoading && filtered.map((app, index) => {
                const umkm = app.umkm || {};
                const booth = app.booth;
                const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={app.id}
                    className="border-b border-[#F3F4F6] px-4 py-3.5 transition-colors hover:bg-[#F9FAFB] last:border-b-0 md:grid md:grid-cols-[50px_1.6fr_1fr_100px_120px_130px] md:items-center md:px-5"
                  >
                    {/* Mobile card view */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] overflow-hidden">
                            {umkm.logo ? (
                              <img src={umkm.logo} alt={umkm.business_name} className="h-full w-full object-cover" />
                            ) : (
                              <FiUser className="h-5 w-5 text-[#1677C8]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#111827]">{umkm.business_name || "UMKM"}</p>
                            <p className="truncate text-xs text-[#9CA3AF]">{umkm.location || "—"}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#F3F4F6] pt-3">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Kategori</p>
                          <span className="mt-0.5 inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#1677C8]">
                            {umkm.category || "—"}
                          </span>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Booth</p>
                          {booth ? (
                            <span className="mt-0.5 inline-flex items-center justify-center rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-bold text-[#111827]">
                              {booth.booth_number}
                            </span>
                          ) : (
                            <p className="mt-0.5 text-xs text-[#D1D5DB]">—</p>
                          )}
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Bergabung</p>
                          <p className="mt-0.5 text-xs font-medium text-[#6B7280]">{formatDate(app.applied_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop grid view */}
                    <div className="hidden md:contents">
                      <div className="text-xs font-semibold text-[#9CA3AF]">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] overflow-hidden">
                          {umkm.logo ? (
                            <img src={umkm.logo} alt={umkm.business_name} className="h-full w-full object-cover" />
                          ) : (
                            <FiUser className="h-4 w-4 text-[#1677C8]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#111827]">{umkm.business_name || "UMKM"}</p>
                          <p className="truncate text-xs text-[#9CA3AF]">{umkm.location || "—"}</p>
                        </div>
                      </div>

                      <div className="pr-2">
                        <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#1677C8]">
                          {umkm.category || "—"}
                        </span>
                      </div>

                      <div>
                        {booth ? (
                          <span className="inline-flex items-center justify-center rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-bold text-[#111827]">
                            {booth.booth_number}
                          </span>
                        ) : (
                          <span className="text-sm text-[#D1D5DB]">—</span>
                        )}
                      </div>

                      <div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-[#6B7280]">
                        {formatDate(app.applied_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination info */}
            {!appsLoading && filtered.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[#9CA3AF]">
                  Menampilkan {filtered.length} tenant
                </p>
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#9CA3AF] transition hover:border-[#1677C8] hover:text-[#1677C8] disabled:opacity-50" disabled>
                    ‹
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677C8] text-xs font-bold text-white">
                    1
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#374151] transition hover:border-[#1677C8] hover:text-[#1677C8]">
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-4">
            {/* Tambah Tenant button */}
            <Link
              to={`/school/applications?event=${eventId}`}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-[#1E88E5] p-5 text-white shadow-lg shadow-[#1E88E5]/25 transition-all hover:shadow-xl hover:shadow-[#1E88E5]/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                  <FiPlus size={22} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">+ Tambah Tenant</p>
                  <p className="text-[11px] text-white/80">Kelola lamaran UMKM</p>
                </div>
              </div>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
            </Link>

            {/* Booth Summary */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF]">
                  <LuLayoutGrid size={18} className="text-[#1677C8]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111827]">Ringkasan Booth</p>
                  <p className="text-[11px] text-[#9CA3AF]">Status penggunaan booth</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#111827]">{boothFilled}<span className="text-base text-[#9CA3AF]">/{boothCapacity}</span></span>
                  <span className="text-sm font-bold text-[#1677C8]">{boothPercent}%</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{boothFilled} booth terisi</p>
              </div>

              {/* Progress bar */}
              <div className="h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1E88E5] to-[#039BE5] transition-all duration-500"
                  style={{ width: `${boothPercent}%` }}
                />
              </div>

              <div className="mt-4 space-y-2 border-t border-[#F3F4F6] pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#6B7280]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Booth Terisi
                  </span>
                  <span className="font-bold text-emerald-600">{boothFilled}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#6B7280]">
                    <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
                    Booth Kosong
                  </span>
                  <span className="font-bold text-[#111827]">{boothEmpty}</span>
                </div>
              </div>

              {/* Lihat Analisis */}
              <Link
                to={`/school/events/${eventId}/analytics`}
                className="mt-4 inline-flex w-full items-center justify-between gap-2 rounded-xl border border-[#1677C8] bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#1677C8] transition hover:bg-[#1677C8] hover:text-white"
              >
                Lihat Analisis →
              </Link>
            </div>

            {/* Event info card */}
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1677C8]">Info Event</p>
              <h3 className="mt-2 text-base font-bold text-[#111827]">{event.name}</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAFAF9]">
                    <FiCalendar size={14} className="text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Tanggal</p>
                    <p className="font-semibold text-[#111827]">{formatDate(event.event_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAFAF9]">
                    <FiMapPin size={14} className="text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Lokasi</p>
                    <p className="font-semibold text-[#111827]">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAFAF9]">
                    <LuStore size={14} className="text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Harga Booth</p>
                    <p className="font-semibold text-[#111827]">Rp{formatRupiah(event.booth_price)}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function StatCard({ label, value, icon: Icon, iconBg, iconColor, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-[-0.8px] text-[#111827]">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-[#6B7280]">{label}</p>
      <div
        className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-xl border border-[#F3F4F6] bg-[#FAFAF9] p-3.5 text-center transition-all hover:-translate-y-0.5 hover:border-[#1677C8] hover:bg-[#EFF6FF] hover:shadow-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white transition-colors group-hover:bg-[#1677C8]">
        <Icon size={16} className="text-[#6B7280] transition-colors group-hover:text-white" />
      </div>
      <span className="text-[10px] font-bold text-[#374151]">{label}</span>
    </button>
  );
}
