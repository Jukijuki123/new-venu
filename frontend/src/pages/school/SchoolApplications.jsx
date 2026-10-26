import { useState, useMemo, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiMail,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiMessageSquare,
  FiArrowRight,
  FiInbox,
} from "react-icons/fi";
import { LuInbox } from "react-icons/lu";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import { useMyEvents } from "../../features/event-management/useMyEvents";
import { useEventApplications } from "../../features/event-management/useEventApplications";
import { approveApplication, rejectApplication } from "../../features/event-management/eventApplicationsApi";
import {
  negotiateCollaboration,
  acceptCollaboration,
  rejectCollaboration,
} from "../../features/umkm/umkmCollaborationApi";

const STATUS_CONFIG = {
  pending: { label: "Menunggu", className: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  reviewing: { label: "Ditinjau", className: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  negotiating: { label: "Negosiasi", className: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
  approved: { label: "Disetujui", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", className: "bg-red-50 text-red-700", dot: "bg-red-500" },
  cancelled: { label: "Dibatalkan", className: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

const EVENT_STATUS_STYLE = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  published: { label: "Aktif", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Ditutup", className: "bg-orange-50 text-orange-700" },
  completed: { label: "Selesai", className: "bg-blue-50 text-blue-700" },
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

export default function SchoolApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEventId, setSelectedEventId] = useState(searchParams.get("event") || "");
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [toast, setToast] = useState(null);

  // nego modal (sekolah bales nego UMKM)
  const [negoApp, setNegoApp] = useState(null);
  const [negoMsg, setNegoMsg] = useState("");
  const [negoPrice, setNegoPrice] = useState("");

  const { events, isLoading: eventsLoading, error: eventsError } = useMyEvents();
  const { applications, isLoading: appsLoading, error: appsError, reload: reloadApps } = useEventApplications(selectedEventId);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!negoApp) return;
    const onKey = (e) => { if (e.key === "Escape") setNegoApp(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [negoApp]);

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setSearchParams({ event: eventId }, { replace: true });
  };

  const handleApprove = async (application) => {
    setActioningId(application.id);
    setActionType("approve");
    try {
      // pakai collaboration accept biar bisa acc dari status negotiating juga
      // fallback ke approveApplication kalau collaboration gagal (mis. event lama)
      try {
        await acceptCollaboration(application.id);
      } catch {
        await approveApplication(application.id);
      }
      setToast({ type: "success", text: "Lamaran disetujui — booth otomatis dibuat." });
      reloadApps();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal menyetujui lamaran." });
    } finally {
      setActioningId(null);
      setActionType(null);
    }
  };

  const handleReject = async (application) => {
    if (!confirm("Yakin ingin menolak lamaran ini?")) return;
    setActioningId(application.id);
    setActionType("reject");
    try {
      try {
        await rejectCollaboration(application.id);
      } catch {
        await rejectApplication(application.id);
      }
      setToast({ type: "success", text: "Lamaran ditolak." });
      reloadApps();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal menolak lamaran." });
    } finally {
      setActioningId(null);
      setActionType(null);
    }
  };

  const openNego = (app) => {
    setNegoApp(app);
    setNegoMsg("");
    setNegoPrice(app.proposed_price != null ? String(app.proposed_price) : "");
  };

  const handleNegoSubmit = async () => {
    if (!negoApp) return;
    const priceNum = negoPrice.trim() === "" ? null : Number(negoPrice.replace(/\D/g, ""));
    if (negoPrice.trim() !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      setToast({ type: "error", text: "Harga penawaran harus angka positif." });
      return;
    }
    if (negoMsg.length > 2000) {
      setToast({ type: "error", text: "Pesan maksimal 2000 karakter." });
      return;
    }
    setActioningId(negoApp.id);
    setActionType("negotiate");
    try {
      await negotiateCollaboration(negoApp.id, {
        message: negoMsg.trim() || null,
        proposed_price: priceNum,
      });
      setToast({ type: "success", text: "Balasan negosiasi terkirim — status jadi Negosiasi." });
      setNegoApp(null);
      reloadApps();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal mengirim negosiasi." });
    } finally {
      setActioningId(null);
      setActionType(null);
    }
  };

  const pendingCount = useMemo(() => applications.filter((a) => a.status === "pending").length, [applications]);
  const negotiatingCount = useMemo(() => applications.filter((a) => a.status === "negotiating").length, [applications]);
  const approvedCount = useMemo(() => applications.filter((a) => a.status === "approved").length, [applications]);
  const totalCount = applications.length;

  return (
    <div className="min-h-screen text-[#111827]">
      <SchoolNavbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-10 top-10 hidden opacity-40 lg:block">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 48 }).map((_, index) => (
              <span key={index} className="h-1 w-1 rounded-full bg-[#9CA3AF]" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:py-14">
          <section className="relative mb-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
                <LuInbox size={14} className="text-[#1677C8]" />
                <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">RUANG KELOLA LAMARAN</span>
              </div>
              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-2.8px] text-[#111827] md:text-6xl lg:text-6xl">
                Lamaran masuk,
                <br />
                <span className="text-[#1677C8]">peluang bermula.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-[#6B7280] md:text-base">
                Pilih event di sebelah kiri untuk melihat daftar pelamar, review proposal mereka, dan tentukan keputusan.
                Kalau ada yang status <span className="font-semibold text-purple-600">Negosiasi</span>, kamu bisa terima, tolak, atau bales nego.
              </p>
            </div>
          </section>

          {toast && (
            <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {toast.text}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <div className="rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden">
                <div className="border-b border-[#E7E5E4] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1677C8]">Event Saya</h2>
                    {events.length > 0 && <span className="text-[10px] font-semibold text-[#A8A29E]">{events.length} event</span>}
                  </div>
                </div>

                {eventsLoading && (
                  <div className="px-6 py-10 text-center">
                    <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#1677C8]" />
                    <p className="text-xs text-[#9CA3AF]">Memuat...</p>
                  </div>
                )}

                {!eventsLoading && eventsError && <div className="p-5 text-center text-xs text-red-600">{eventsError}</div>}

                {!eventsLoading && !eventsError && events.length === 0 && (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAFAF9]">
                      <LuInbox className="h-7 w-7 text-[#D1D5DB]" />
                    </div>
                    <p className="text-sm font-semibold text-[#374151]">Belum ada event</p>
                    <p className="mt-1 text-xs text-[#9CA3AF]">Buat event terlebih dahulu</p>
                  </div>
                )}

                {!eventsLoading && !eventsError && events.length > 0 && (
                  <ul className="divide-y divide-[#F1F0EF]">
                    {events.map((event) => {
                      const evStatus = EVENT_STATUS_STYLE[event.status] || EVENT_STATUS_STYLE.draft;
                      const isSelected = selectedEventId === event.id;
                      return (
                        <li key={event.id}>
                          <NavLink
                            to={`/school/applications?event=${event.id}`}
                            className={`group relative block px-6 py-5 transition-all duration-300 ${isSelected ? "bg-[#EEF6FF]" : "hover:bg-[#FAFAF9]"}`}
                            onClick={() => handleSelectEvent(event.id)}
                          >
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1677C8]" />}
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center gap-2 flex-wrap">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${evStatus.className}`}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {evStatus.label}
                                  </span>
                                </div>
                                <h3 className="text-base font-bold text-[#111827] leading-tight">{event.name}</h3>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#6B7280]">
                                  <span className="flex items-center gap-1.5"><FiCalendar size={11} />{formatDate(event.event_date)}</span>
                                  <span className="flex items-center gap-1.5"><FiMapPin size={11} />{event.location}</span>
                                </div>
                              </div>
                              <FiArrowRight className={`shrink-0 h-4 w-4 transition-all duration-300 ${isSelected ? "text-[#1677C8] translate-x-1" : "text-[#D1D5DB] -rotate-90 group-hover:translate-x-0.5"}`} />
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-[#F1F0EF] pt-3 text-[10px]">
                              <span className="flex items-center gap-1 text-[#9CA3AF]"><FiUser size={10} /> {event.booth_capacity || 0} booth</span>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-[2px] bg-[#1677C8] transition-all duration-500 ${isSelected ? "w-full" : "w-0 group-hover:w-full"}`} />
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </aside>

            <div className="min-w-0">
              {!selectedEventId ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E5E4] bg-white p-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FAFAF9]">
                    <LuInbox className="h-10 w-10 text-[#D1D5DB]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#111827] tracking-[-0.8px]">Pilih Event</h3>
                  <p className="mt-3 max-w-md text-sm text-[#6B7280]">Pilih salah satu event di panel kiri untuk melihat daftar lamaran UMKM yang masuk.</p>
                </div>
              ) : (
                <>
                  {(() => {
                    const ev = events.find((e) => e.id === selectedEventId);
                    if (!ev) return null;
                    const evStatus = EVENT_STATUS_STYLE[ev.status] || EVENT_STATUS_STYLE.draft;
                    return (
                      <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white">
                        <div className="p-6 md:p-8">
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${evStatus.className}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {evStatus.label}
                            </span>
                            {negotiatingCount > 0 && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> {negotiatingCount} negosiasi
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <h2 className="text-3xl font-extrabold tracking-[-1.5px] text-[#111827] md:text-4xl">{ev.name}</h2>
                              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <InfoItem icon={FiCalendar} text={formatDate(ev.event_date)} />
                                <InfoItem icon={FiMapPin} text={ev.location} />
                                <InfoItem icon={FiDollarSign} text={`Rp${formatRupiah(ev.booth_price)} / booth`} />
                                <InfoItem icon={FiUser} text={`${ev.booth_capacity || 0} booth tersedia`} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap border-t border-[#F1F0EF] md:flex-nowrap">
                          <StatItem number={totalCount} label="Total Lamaran" />
                          <StatItem number={pendingCount} label="Menunggu" accent />
                          {negotiatingCount > 0 && <StatItem number={negotiatingCount} label="Negosiasi" accent />}
                          <StatItem number={approvedCount} label="Disetujui" success />
                        </div>
                      </div>
                    );
                  })()}

                  {appsLoading && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#E7E5E4] bg-white py-12">
                      <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#1677C8]" />
                      <p className="text-sm text-[#9CA3AF]">Memuat lamaran...</p>
                    </div>
                  )}

                  {appsError && <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600">{appsError}</div>}

                  {!appsLoading && !appsError && applications.length === 0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E5E4] bg-white p-12 text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FAFAF9]">
                        <FiMail className="h-10 w-10 text-[#D1D5DB]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#111827] tracking-[-0.8px]">Belum ada lamaran</h3>
                      <p className="mt-3 max-w-md text-sm text-[#6B7280]">Event ini belum menerima lamaran dari UMKM manapun.</p>
                    </div>
                  )}

                  {!appsLoading && !appsError && applications.length > 0 && (
                    <div className="space-y-5">
                      {applications.map((app, index) => {
                        const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                        const umkm = app.umkm || {};
                        const booth = app.booth;
                        const isActionable = ["pending", "reviewing", "negotiating"].includes(app.status);
                        const busy = actioningId === app.id;

                        return (
                          <article
                            key={app.id}
                            className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#D6D3D1] hover:shadow-[0_20px_50px_rgba(17,24,39,0.08)]"
                          >
                            <div className="absolute right-5 top-5 hidden text-[11px] font-bold tracking-widest text-[#E7E5E4] md:block">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="p-6 md:p-8">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-5 min-w-0">
                                  <div className="shrink-0 h-14 w-14 rounded-xl bg-[#FAFAF9] flex items-center justify-center overflow-hidden border border-[#F1F0EF]">
                                    {umkm.logo ? <img src={umkm.logo} alt={umkm.business_name} className="h-full w-full object-cover" /> : <FiUser className="h-7 w-7 text-[#9CA3AF]" />}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <h3 className="text-xl font-bold text-[#111827] tracking-[-0.5px] truncate">{umkm.business_name || "UMKM"}</h3>
                                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${statusCfg.className}`}>
                                        <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
                                        {statusCfg.label}
                                      </span>
                                      {app.initiated_by === "school" && (
                                        <span className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#64748B]">Undangan sekolah</span>
                                      )}
                                    </div>
                                    <p className="mt-1.5 truncate text-sm text-[#6B7280]">
                                      {umkm.category || "Kategori tidak tersedia"} · {umkm.location || "Lokasi tidak tersedia"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-[#9CA3AF]">
                                      <span className="flex items-center gap-1.5"><FiMessageSquare size={11} />{app.message ? "Dengan pesan" : "Tanpa pesan"}</span>
                                      {app.proposed_price != null && (
                                        <span className="flex items-center gap-1.5 font-semibold text-[#1677C8]"><FiDollarSign size={11} /> Rp{formatRupiah(app.proposed_price)}</span>
                                      )}
                                      <span className="flex items-center gap-1.5"><FiClock size={11} /> {formatDate(app.applied_at)}</span>
                                      {booth?.booth_number && <span className="font-bold text-emerald-600">Booth {booth.booth_number}</span>}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {isActionable ? (
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleReject(app)}
                                        disabled={busy}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E5E4] bg-white px-3.5 py-2 text-xs font-semibold text-[#6B7280] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                      >
                                        <FiX size={12} /> {busy && actionType === "reject" ? "..." : "Tolak"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openNego(app)}
                                        disabled={busy}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDE9FE] bg-white px-3.5 py-2 text-xs font-semibold text-[#7C3AED] transition hover:bg-[#F5F3FF] disabled:opacity-50"
                                      >
                                        <FiMessageSquare size={12} /> Nego
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleApprove(app)}
                                        disabled={busy}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#15803D] disabled:opacity-50"
                                      >
                                        <FiCheck size={12} /> {busy && actionType === "approve" ? "..." : app.status === "negotiating" ? "ACC Nego" : "Setujui"}
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      {app.status === "approved" && booth && (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                                          <FiCheck size={14} className="text-emerald-500" /> Booth {booth.booth_number}
                                        </span>
                                      )}
                                      {app.status === "rejected" && (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
                                          <FiX size={14} className="text-red-500" /> Ditolak
                                        </span>
                                      )}
                                      {app.status === "cancelled" && (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">Dibatalkan</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              {app.message && (
                                <div className="mt-5 border-t border-[#F1F0EF] bg-[#FAFAF9] rounded-xl p-5">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF] mb-2">Pesan {app.status === "negotiating" ? "(negosiasi terbaru)" : "dari UMKM"}</p>
                                  <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">“{app.message}”</p>
                                </div>
                              )}

                              {app.proposed_price != null && (
                                <div className={`rounded-xl p-5 ${app.message ? "mt-3 bg-white border border-[#F1F0EF]" : "mt-5 bg-[#FAFAF9] border-t border-[#F1F0EF]"}`}>
                                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF] mb-1">Harga Penawaran</p>
                                  <p className="text-lg font-bold text-[#1677C8]">Rp{formatRupiah(app.proposed_price)}</p>
                                  {app.status === "negotiating" && <p className="mt-1 text-[11px] text-[#9CA3AF]">Klik ACC Nego untuk menyetujui harga ini (booth dibuat otomatis), atau Nego untuk bales tawar.</p>}
                                </div>
                              )}

                              {app.match_score !== undefined && app.match_score !== null && (
                                <div className="mt-5 border-t border-[#F1F0EF] pt-5">
                                  <div className="flex items-center gap-2 mb-3">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF]">Skor Kecocokan AI</p>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${app.match_score >= 80 ? "bg-emerald-50 text-emerald-700" : app.match_score >= 50 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                                      {app.match_score}%
                                    </span>
                                  </div>
                                  {app.match_reason && Array.isArray(app.match_reason) && app.match_reason.length > 0 && (
                                    <ul className="space-y-2">
                                      {app.match_reason.map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[#6B7280]">
                                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1677C8] shrink-0" />
                                          {r}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#1677C8] transition-all duration-500 group-hover:w-full" />
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {negoApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup" onClick={() => setNegoApp(null)} className="absolute inset-0 bg-[#0B2340]/50 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#EEF2F7] px-6 py-4">
              <h3 className="text-[15px] font-extrabold text-[#0B2340]">Balas negosiasi — {negoApp.umkm?.business_name || "UMKM"}</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Tawaran UMKM saat ini: <span className="font-bold text-[#1677C8]">{negoApp.proposed_price != null ? `Rp${formatRupiah(negoApp.proposed_price)}` : "—"}</span>
                {negoApp.message ? <> · Pesan: “{negoApp.message}”</> : null}
                <br />
                Kamu bisa bales dengan harga/catat baru, atau langsung <span className="font-semibold">ACC Nego</span> di card tanpa buka modal ini.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Pesan balasan <span className="font-normal text-[#94A3B8]">(maks 2000)</span></span>
                <textarea value={negoMsg} onChange={(e) => setNegoMsg(e.target.value)} maxLength={2000} rows={4} placeholder="Contoh: Oke kak, kita deal di harga segini ya..." className="mt-1 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677C8]" />
                <span className="mt-1 block text-right text-[11px] text-[#94A3B8]">{negoMsg.length}/2000</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Harga penawaran baru <span className="font-normal text-[#94A3B8]">(Rp, kosongkan jika setuju harga UMKM)</span></span>
                <input value={negoPrice} onChange={(e) => setNegoPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="mis. 350000" className="mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                {negoPrice && <span className="mt-1 block text-xs text-[#64748B]">≈ Rp{formatRupiah(Number(negoPrice))}</span>}
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-6 py-4">
              <button type="button" onClick={() => setNegoApp(null)} disabled={actioningId != null} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-60">Batal</button>
              <button type="button" onClick={handleNegoSubmit} disabled={actioningId != null} className="rounded-full bg-[#7C3AED] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#6D28D9] disabled:opacity-60">
                {actioningId === negoApp.id && actionType === "negotiate" ? "Mengirim..." : "Kirim Balasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, text }) {
  return (
    <span className="flex items-center gap-2 text-sm text-[#6B7280]">
      <Icon size={15} className="text-[#9CA3AF]" />
      {text}
    </span>
  );
}

function StatItem({ number, label, accent = false, success = false }) {
  return (
    <div className={`flex-1 border-r border-[#F1F0EF] px-5 py-4 last:border-r-0 md:px-6 ${accent ? "bg-[#EEF6FF]" : ""}`}>
      <p className={`text-2xl font-bold tracking-[-1px] ${accent ? "text-[#1677C8]" : success ? "text-emerald-600" : "text-[#111827]"}`}>{number}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#9CA3AF]">{label}</p>
    </div>
  );
}
