import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiInbox,
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiMessageSquare,
  FiArrowRight,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import UmkmNavbar from "../../components/layout/UmkmNavbar";
import { useUmkmApplications } from "../../features/umkm/useUmkmApplications";
import { getEventImage } from "../../utils/umkmImage";
import {
  acceptCollaboration,
  rejectCollaboration,
  negotiateCollaboration,
  cancelCollaboration,
} from "../../features/umkm/umkmCollaborationApi";

const STATUS = {
  pending: { label: "Menunggu", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  reviewing: { label: "Ditinjau", cls: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  negotiating: { label: "Negosiasi", cls: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
  approved: { label: "Diterima", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", cls: "bg-red-50 text-red-700", dot: "bg-red-500" },
  cancelled: { label: "Dibatalkan", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  completed: { label: "Selesai", cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

function fmtDate(s) {
  if (!s) return "-";
  try { return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); } catch { return s; }
}
function fmtRp(n) { return "Rp" + Number(n || 0).toLocaleString("id-ID"); }

export default function LamaranSaya() {
  const { applications, isLoading, error, reload } = useUmkmApplications();
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [toast, setToast] = useState(null);

  // negotiate modal
  const [negoApp, setNegoApp] = useState(null);
  const [negoMsg, setNegoMsg] = useState("");
  const [negoPrice, setNegoPrice] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((a) => ["pending", "reviewing", "negotiating"].includes(a.status)).length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => ["rejected", "cancelled"].includes(a.status)).length,
  }), [applications]);

  const handleAccept = async (app) => {
    setActioningId(app.id); setActionType("accept");
    try {
      await acceptCollaboration(app.id);
      setToast({ type: "success", text: "Undangan diterima. Booth kamu sudah dibuat." });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal menerima undangan." });
    } finally { setActioningId(null); setActionType(null); }
  };

  const handleReject = async (app) => {
    if (!confirm("Yakin ingin menolak undangan ini?")) return;
    setActioningId(app.id); setActionType("reject");
    try {
      await rejectCollaboration(app.id);
      setToast({ type: "success", text: "Undangan ditolak." });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal menolak." });
    } finally { setActioningId(null); setActionType(null); }
  };

  const handleCancel = async (app) => {
    if (!confirm("Batalkan lamaran ini?")) return;
    setActioningId(app.id); setActionType("cancel");
    try {
      await cancelCollaboration(app.id);
      setToast({ type: "success", text: "Lamaran dibatalkan." });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal membatalkan." });
    } finally { setActioningId(null); setActionType(null); }
  };

  const openNego = (app) => {
    setNegoApp(app);
    setNegoMsg(app.message || "");
    setNegoPrice(app.proposed_price != null ? String(app.proposed_price) : "");
  };

  const handleNegoSubmit = async () => {
    if (!negoApp) return;
    const priceNum = negoPrice.trim() === "" ? null : Number(negoPrice.replace(/\D/g, ""));
    if (negoPrice.trim() !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      setToast({ type: "error", text: "Harga penawaran harus angka positif." }); return;
    }
    if (negoMsg.length > 2000) { setToast({ type: "error", text: "Pesan maksimal 2000 karakter." }); return; }
    setActioningId(negoApp.id); setActionType("negotiate");
    try {
      await negotiateCollaboration(negoApp.id, {
        message: negoMsg.trim() || null,
        proposed_price: priceNum,
      });
      setToast({ type: "success", text: "Penawaran negosiasi terkirim." });
      setNegoApp(null);
      reload();
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Gagal negosiasi." });
    } finally { setActioningId(null); setActionType(null); }
  };

  useEffect(() => {
    if (!negoApp) return;
    const onKey = (e) => { if (e.key === "Escape") setNegoApp(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [negoApp]);

  return (
    <div className="min-h-screen font-sans text-[#111827]">
      <UmkmNavbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-10 top-10 hidden opacity-40 lg:block">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-[#9CA3AF]" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10">
          <section className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
              <FiInbox size={14} className="text-[#1677C8]" />
              <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">LAMARAN SAYA</span>
            </div>
            <h1 className="text-4xl font-bold leading-[0.95] tracking-[-2px] text-[#111827] md:text-5xl">
              Pantau lamaran
              <br />
              <span className="text-[#1677C8]">dan undangan.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Semua pendaftaran lewat Jelajah Event atau AI Match tercatat di sini. Undangan dari sekolah bisa kamu terima, tolak, atau nego langsung — prosesnya sama seperti di halaman Sekolah.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/umkm/events" className="inline-flex items-center gap-1.5 rounded-full bg-[#1677C8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1268B2]">
                Jelajah Event <FiArrowRight size={12} />
              </Link>
              <Link to="/umkm/ai-match/hasil" className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-bold text-[#0B2340] hover:border-[#1677C8] hover:text-[#1677C8]">
                <LuSparkles size={12} /> AI Match
              </Link>
            </div>
          </section>

          {toast && (
            <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {toast.text}
            </div>
          )}

          {/* STATS — 4 card white kayak EventSaya */}
          <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { label: "Total", value: counts.total },
              { label: "Menunggu", value: counts.pending },
              { label: "Diterima", value: counts.approved },
              { label: "Ditolak", value: counts.rejected },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#E6ECF3] bg-white p-4 shadow-sm md:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">{s.label}</p>
                <p className="mt-1 text-[26px] font-bold leading-none text-[#0B2340]">{isLoading ? "—" : s.value}</p>
              </div>
            ))}
          </section>

          {/* LIST */}
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold tracking-wide text-[#0B2340]">Daftar lamaran & undangan</h2>
              {!isLoading && <span className="text-xs text-[#94A3B8]">{applications.length} data</span>}
            </div>

            {isLoading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[212px] animate-pulse rounded-2xl border border-[#E6ECF3] bg-white" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-600">{error}</div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF6FF] text-[#1677C8]">
                  <FiInbox size={22} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#0B2340]">Belum ada lamaran</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-[#94A3B8]">Mulai dari Jelajah Event atau AI Match untuk mendaftar.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link to="/umkm/events" className="rounded-full bg-[#1677C8] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1268B2]">Jelajah Event</Link>
                  <Link to="/umkm/ai-match/hasil" className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-xs font-bold text-[#0B2340] hover:border-[#1677C8]">AI Match</Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((app) => {
                  const ev = app.event;
                  const s = STATUS[app.status] || STATUS.pending;
                  const isActionable = ["pending", "reviewing", "negotiating"].includes(app.status);
                  const isSchoolInvite = app.initiated_by === "school";
                  const busy = actioningId === app.id;

                  return (
                    <article key={app.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm transition hover:shadow-md">
                      {/* header */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#EEF2F7] p-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.cls}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
                            </span>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${isSchoolInvite ? "border-[#EEF6FF] bg-[#EEF6FF] text-[#1677C8]" : "border-[#E2E8F0] bg-white text-[#64748B]"}`}>
                              {isSchoolInvite ? "Undangan sekolah" : "Lamaran mandiri"}
                            </span>
                            {app.match_score != null && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-bold text-[#FF8A00]">
                                <LuSparkles size={10} /> {app.match_score}% cocok
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 truncate text-[15px] font-bold leading-tight text-[#0B2340] group-hover:text-[#1677C8]">
                            {ev?.name || `Event #${app.event_id}`}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#94A3B8]">{ev?.school?.name || ev?.school_name || "Sekolah penyelenggara"}</p>
                        </div>
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#EEF2F7]">
                          <img src={getEventImage(ev)} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      </div>

                      {/* meta grid kayak EventSaya */}
                      <div className="grid grid-cols-3 gap-2 px-4 py-3 text-[11px]">
                        <Cell label="Tanggal" value={fmtDate(ev?.event_date || app.applied_at)} icon={FiCalendar} />
                        <Cell label="Lokasi" value={ev?.location || "-"} icon={FiMapPin} />
                        <Cell label="Booth" value={ev?.booth_price != null ? fmtRp(ev.booth_price) : "-"} icon={FiDollarSign} />
                      </div>

                      {/* message / booth */}
                      {(app.message || app.proposed_price != null || app.booth) && (
                        <div className="mx-4 rounded-xl bg-[#F8FAFD] px-3 py-3">
                          {app.message && <p className="text-xs leading-5 text-[#334155]">“{app.message}”</p>}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {app.proposed_price != null && (
                              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B2340] ring-1 ring-[#E2E8F0]">Tawar: {fmtRp(app.proposed_price)}</span>
                            )}
                            {app.booth?.booth_number && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">Booth {app.booth.booth_number}</span>
                            )}
                          </div>
                          {app.booth?.booth_number && <p className="mt-1 text-[10px] text-[#94A3B8]">Booth dibuat otomatis saat diterima — kapasitas dicek server.</p>}
                        </div>
                      )}

                      {/* footer — aksi terima/tolak kayak SchoolApplications */}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                          <FiClock size={11} /> {fmtDate(app.applied_at)}
                        </span>

                        {isActionable ? (
                          isSchoolInvite ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleReject(app)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-bold text-[#64748B] hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                              >
                                <FiX size={12} /> {busy && actionType === "reject" ? "..." : "Tolak"}
                              </button>
                              <button
                                type="button"
                                onClick={() => openNego(app)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-full border border-[#EDE9FE] bg-white px-3 py-1.5 text-[11px] font-bold text-[#7C3AED] hover:bg-[#F5F3FF] disabled:opacity-50"
                              >
                                <FiMessageSquare size={12} /> Nego
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAccept(app)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#15803D] disabled:opacity-60"
                              >
                                <FiCheck size={12} /> {busy && actionType === "accept" ? "..." : "Terima"}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openNego(app)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-full border border-[#EDE9FE] bg-white px-3 py-1.5 text-[11px] font-bold text-[#7C3AED] hover:bg-[#F5F3FF] disabled:opacity-50"
                              >
                                <FiMessageSquare size={12} /> Nego
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancel(app)}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-bold text-[#64748B] hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                              >
                                <FiX size={12} /> {busy && actionType === "cancel" ? "..." : "Batalkan"}
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="text-[11px] font-semibold text-[#94A3B8]">
                            {app.status === "approved" && app.booth ? `Booth ${app.booth.booth_number} · selesai` : "Sudah final"}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* NEGO MODAL — clean white, kayak School */}
      {negoApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup" onClick={() => setNegoApp(null)} className="absolute inset-0 bg-[#0B2340]/50 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#EEF2F7] px-6 py-4">
              <h3 className="text-[15px] font-extrabold text-[#0B2340]">Ajukan negosiasi</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Kirim penawaran baru untuk <span className="font-semibold text-[#0B2340]">{negoApp.event?.name || `Event #${negoApp.event_id}`}</span>. Status akan jadi <span className="font-semibold">Negosiasi</span>.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Pesan <span className="font-normal text-[#94A3B8]">(maks 2000)</span></span>
                <textarea value={negoMsg} onChange={(e) => setNegoMsg(e.target.value)} maxLength={2000} rows={4} placeholder="Contoh: Terima kasih undangannya, saya ingin diskusi harga booth..." className="mt-1 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677C8]" />
                <span className="mt-1 block text-right text-[11px] text-[#94A3B8]">{negoMsg.length}/2000</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Harga penawaran <span className="font-normal text-[#94A3B8]">(Rp, kosongkan jika ikut harga booth)</span></span>
                <input value={negoPrice} onChange={(e) => setNegoPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="mis. 350000" className="mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677C8]" />
                {negoPrice && <span className="mt-1 block text-xs text-[#64748B]">≈ {fmtRp(Number(negoPrice))}</span>}
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-6 py-4">
              <button type="button" onClick={() => setNegoApp(null)} disabled={actioningId != null} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-60">Batal</button>
              <button type="button" onClick={handleNegoSubmit} disabled={actioningId != null} className="rounded-full bg-[#7C3AED] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#6D28D9] disabled:opacity-60">
                {actioningId === negoApp.id && actionType === "negotiate" ? "Mengirim..." : "Kirim Negosiasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">
        {Icon && <Icon size={10} />} {label}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-semibold text-[#0B2340]">{value || "-"}</p>
    </div>
  );
}
