import { useState, useMemo, useEffect } from "react";
import SchoolNavbar from "../components/layout/SchoolNavbar";
import { useSchoolMatches } from "../features/ai-match/useSchoolMatches";
import { schoolInviteUmkm } from "../features/ai-match/matchApi";
import { getUmkmImage } from "../utils/umkmImage";

function fmtRp(n) {
  if (n == null) return "-";
  return "Rp" + Number(n).toLocaleString("id-ID");
}

function ScoreBadge({ score }) {
  const bg = score >= 90 ? "bg-[#EAF8F0] text-[#16834A]" : score >= 70 ? "bg-[#EAF3FF] text-[#1677C8]" : "bg-[#FFF4E5] text-[#D97706]";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${bg}`}>{score}% Cocok</span>;
}

// SCHOOL -> UMKM — popup disesuaikan untuk sekolah mengundang UMKM
export default function AiMatchSchool() {
  const { events, selectedEventId, setSelectedEventId, matches, isLoadingEvents, isLoadingMatches, error } = useSchoolMatches();
  const [selectedUmkmId, setSelectedUmkmId] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [proposalMsg, setProposalMsg] = useState(null);
  const [sendingId, setSendingId] = useState(null);

  // popup — sekolah mengundang UMKM
  const [showModal, setShowModal] = useState(false);
  const [pendingUmkm, setPendingUmkm] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalPrice, setModalPrice] = useState("");

  const selectedEvent = useMemo(() => events.find((e) => e.id === selectedEventId) ?? null, [events, selectedEventId]);

  const filtered = useMemo(() => {
    let list = matches;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.business_name?.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q) || m.location?.toLowerCase().includes(q));
    }
    if (catFilter) list = list.filter((m) => m.category === catFilter);
    return list;
  }, [matches, search, catFilter]);

  const selected = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.find((m) => m.umkm_id === selectedUmkmId) ?? filtered[0];
  }, [filtered, selectedUmkmId]);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const openInviteModal = (umkm) => {
    if (!selectedEvent || !umkm) return;
    if (umkm.application_status) return;
    setPendingUmkm(umkm);
    setModalMessage(`Halo ${umkm.business_name}, kami dari ${selectedEvent.name} tertarik mengundang usaha kamu sebagai tenant. Booth: ${fmtRp(selectedEvent.booth_price ?? umkm.booth_budget_max ?? 0)}. Mari kolaborasi!`);
    setModalPrice(selectedEvent.booth_price != null ? String(selectedEvent.booth_price) : "");
    setProposalMsg(null);
    setShowModal(true);
  };

  const handleConfirmInvite = async () => {
    if (!selectedEvent || !pendingUmkm) return;
    const priceNum = modalPrice.trim() === "" ? null : Number(modalPrice.replace(/\D/g, ""));
    if (modalPrice.trim() !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      setProposalMsg({ type: "error", text: "Harga penawaran harus angka positif." });
      return;
    }
    if (modalMessage.length > 2000) {
      setProposalMsg({ type: "error", text: "Pesan maksimal 2000 karakter." });
      return;
    }
    setSendingId(pendingUmkm.umkm_id);
    setProposalMsg(null);
    try {
      await schoolInviteUmkm({
        event_id: selectedEvent.id,
        umkm_id: pendingUmkm.umkm_id,
        message: modalMessage.trim() || null,
        proposed_price: priceNum,
      });
      setShowModal(false);
      setProposalMsg({ type: "success", text: `Proposal terkirim ke ${pendingUmkm.business_name}! Menunggu review UMKM.` });
      const cur = selectedEventId;
      setSelectedEventId(null);
      setTimeout(() => setSelectedEventId(cur), 50);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.message?.[0] || "Gagal mengirim proposal.";
      setProposalMsg({ type: "error", text: msg });
    } finally { setSendingId(null); }
  };

  if (isLoadingEvents) {
    return (
      <>
        <SchoolNavbar />
        <div className="mx-auto max-w-[1220px] px-5 py-12 md:px-8"><p className="text-sm text-[#94A3B8]">Memuat event...</p></div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <SchoolNavbar />
        <div className="mx-auto max-w-[1220px] px-5 py-12 md:px-8"><p className="text-sm text-red-600">{error}</p></div>
      </>
    );
  }
  if (!events.length) {
    return (
      <>
        <SchoolNavbar />
        <div className="mx-auto max-w-[1220px] px-5 py-12 md:px-8">
          <div className="rounded-2xl border border-[#D8E2EB] bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-[#062B52]">Kamu belum punya event</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">Buat event terlebih dahulu untuk mendapatkan rekomendasi UMKM.</p>
          </div>
        </div>
      </>
    );
  }

  const categories = [...new Set(matches.map((m) => m.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      <SchoolNavbar />

      <div className="border-b border-[#E6ECF3] bg-white">
        <div className="mx-auto max-w-[1220px] px-5 py-6 md:px-8 md:py-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1677FF]">VENU · AI Match · Sekolah → UMKM</p>
          <h1 className="mt-1 text-[22px] font-bold leading-tight text-[#0B2340] md:text-[33px]">
            Rekomendasi UMKM untuk <span className="text-[#2575B8]">{selectedEvent?.name ?? "Event Kamu"}</span>
          </h1>
          <p className="mt-2 max-w-[720px] text-sm leading-6 text-[#64748B]">
            AI kami mencocokkan kebutuhan event dengan profil UMKM — kategori, lokasi, target audiens, dan budget booth — untuk hasil terbaik.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end">
            <label className="block flex-1 md:max-w-[420px]">
              <span className="text-xs font-semibold text-[#0B294D]">Pilih Event</span>
              <select
                value={selectedEventId ?? ""}
                onChange={(e) => { setSelectedEventId(Number(e.target.value)); setSelectedUmkmId(null); }}
                className="mt-1 h-10 w-full rounded-xl border border-[#D8E2EB] bg-white px-3 text-sm text-[#0B294D] outline-none focus:border-[#1677FF]"
              >
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name} · {ev.location} · {ev.status}</option>)}
              </select>
            </label>
            <div className="relative flex-1 md:max-w-[380px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20L16 16" /></svg>
              </span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari UMKM, kategori, lokasi..." className="h-10 w-full rounded-full border border-[#E2E8F0] bg-white pl-9 pr-4 text-sm placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setCatFilter("")} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${!catFilter ? "border-[#1677FF] bg-[#EEF6FF] text-[#1677FF]" : "border-[#E2E8F0] bg-white text-[#64748B]"}`}>Semua Kategori</button>
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => setCatFilter(c)} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${catFilter === c ? "border-[#1677FF] bg-[#EEF6FF] text-[#1677FF]" : "border-[#E2E8F0] bg-white text-[#64748B]"}`}>{c}</button>
            ))}
            <span className="ml-auto text-xs text-[#94A3B8]">{filtered.length} UMKM ditemukan</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1220px] px-5 py-6 md:px-8">
        {isLoadingMatches ? (
          <div className="grid gap-5 lg:grid-cols-[1.55fr_0.9fr]">
            <div className="grid gap-3 sm:grid-cols-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-[220px] animate-pulse rounded-2xl bg-white" />)}</div>
            <div className="h-[520px] animate-pulse rounded-2xl bg-white" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
            <p className="text-sm font-semibold text-[#0B294D]">Belum ada UMKM yang cocok dengan filter ini</p>
            <p className="mt-1 text-sm text-[#94A3B8]">Coba ubah kategori atau pencarian.</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.55fr_0.9fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((m) => {
                const active = selected?.umkm_id === m.umkm_id;
                const img = getUmkmImage(m);
                return (
                  <button
                    key={m.umkm_id}
                    type="button"
                    onClick={() => setSelectedUmkmId(m.umkm_id)}
                    className={`overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${active ? "border-[#1677FF] ring-1 ring-[#1677FF]/20" : "border-[#E6ECF3] hover:border-[#C9D9EF]"}`}
                  >
                    <div className="relative h-[148px] overflow-hidden bg-[#EEF2F7]">
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <span className="absolute right-2 top-2 rounded-full bg-[#16A34A] px-2.5 py-1 text-[11px] font-bold text-white shadow">{m.match_score}% Cocok</span>
                    </div>
                    <div className="p-4">
                      <h3 className="truncate text-[15px] font-bold text-[#0B2340]">{m.business_name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748B]">
                        <span className="inline-flex items-center gap-1 text-[#F59E0B]">★ 4.9</span>
                        <span className="text-[#CBD5E1]">·</span> {m.category} · {m.location}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#EEF6FF] px-2.5 py-1 text-[11px] font-semibold text-[#1677FF]">{m.category}</span>
                        <span className="rounded-full bg-[#F8FAFD] px-2.5 py-1 text-[11px] font-medium text-[#64748B]">{m.location}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8]">{fmtRp(m.price_min)} – {fmtRp(m.price_max)}</span>
                        {m.application_status && <span className="rounded-full bg-[#EEF2F7] px-2 py-0.5 text-[11px] font-semibold text-[#64748B]">{m.application_status}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E6ECF3] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#0B2340]">Alur Kolaborasi</h3>
                <p className="mt-1 text-xs text-[#94A3B8]">5 langkah dari rekomendasi hingga pelaksanaan event.</p>
                <ol className="relative mt-4 space-y-0">
                  {[
                    { n: 1, title: "Temukan UMKM", desc: "AI merekomendasikan UMKM paling cocok untuk eventmu." },
                    { n: 2, title: "Lihat Profil", desc: "Cek kategori, lokasi, harga & kecocokan." },
                    { n: 3, title: "Kirim Proposal", desc: "Ajukan kolaborasi — UMKM akan meninjau." },
                    { n: 4, title: "Negosiasi", desc: "Diskusi harga & kebutuhan booth jika perlu." },
                    { n: 5, title: "Pelaksanaan", desc: "UMKM terkonfirmasi sebagai tenant event." },
                  ].map((step, i, arr) => (
                    <li key={step.n} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < arr.length - 1 && <span className="absolute left-[11px] top-[26px] h-[calc(100%-6px)] w-px bg-[#E2E8F0]" />}
                      <span className="relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#1677FF] text-[11px] font-bold text-white">{step.n}</span>
                      <div className="-mt-0.5">
                        <p className="text-sm font-semibold text-[#0B2340]">{step.title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-[#64748B]">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {selected && (
                <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm">
                  <div className="border-b border-[#EEF2F7] bg-[#F8FAFD] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8]">UMKM Terpilih</p>
                    <h3 className="mt-1 text-[17px] font-bold text-[#0B2340]">{selected.business_name}</h3>
                    <p className="mt-1 text-xs text-[#64748B]">{selected.category} · {selected.location} · {selected.target_audience || "-"}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <ScoreBadge score={selected.match_score} />
                      {selected.application_status ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Status: {selected.application_status}</span>
                      ) : (
                        <span className="text-xs text-[#94A3B8]">Belum ada pengajuan</span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm leading-6 text-[#334155]">{selected.description || "UMKM ini belum menambahkan deskripsi usaha."}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-[#F8FAFD] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Kisaran Harga</p>
                        <p className="mt-1 text-sm font-bold text-[#0B2340]">{fmtRp(selected.price_min)} – {fmtRp(selected.price_max)}</p>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFD] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Budget Booth</p>
                        <p className="mt-1 text-sm font-bold text-[#0B2340]">{selected.booth_budget_max ? fmtRp(selected.booth_budget_max) : "-"}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#F8FAFD] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-[#0B2340]">Kenapa Cocok?</p>
                        {selected.match_reason_ai && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#1677C8]">
                            <span>✨</span> AI Analysis
                          </span>
                        )}
                      </div>
                      {selected.match_reason_ai ? (
                        <p className="text-sm text-[#334155] leading-relaxed">{selected.match_reason_ai}</p>
                      ) : (
                        <ul className="mt-2 space-y-1.5">
                          {(selected.match_reason && selected.match_reason.length > 0 ? selected.match_reason : ["Belum ada kecocokan spesifik."]).map((r) => (
                            <li key={r} className="flex items-center gap-2 text-sm text-[#334155]">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF4E5] text-xs text-[#F59E0B]">✓</span> {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <h4 className="text-sm font-bold text-[#0B2340]">Status Pengajuan Kolaborasi</h4>
                      <div className="mt-3 rounded-lg bg-[#F8FAFD] p-3">
                        <p className="text-xs text-[#64748B]">Event</p>
                        <p className="text-sm font-semibold text-[#0B2340]">{selectedEvent?.name} · {selectedEvent?.location}</p>
                        <p className="mt-2 text-xs text-[#64748B]">UMKM</p>
                        <p className="text-sm font-semibold text-[#0B2340]">{selected.business_name}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${selected.application_status === "approved" ? "bg-emerald-50 text-emerald-700" : selected.application_status === "rejected" ? "bg-red-50 text-red-700" : selected.application_status ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                            <span className={`h-2 w-2 rounded-full ${selected.application_status === "approved" ? "bg-emerald-500" : selected.application_status === "rejected" ? "bg-red-500" : selected.application_status ? "bg-amber-500" : "bg-slate-400"}`} />
                            {selected.application_status ? (selected.application_status === "pending" ? "Sedang Ditinjau" : selected.application_status) : "Belum Diajukan"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {proposalMsg && <p className={`mt-3 text-xs ${proposalMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{proposalMsg.text}</p>}

                    <div className="mt-4">
                      {selected.application_status ? (
                        <div className="rounded-xl bg-[#EEF2F7] px-4 py-3 text-center text-sm font-semibold text-[#64748B]">Proposal sudah terkirim · Status: {selected.application_status}</div>
                      ) : (
                        <button type="button" onClick={() => openInviteModal(selected)} className="w-full rounded-full bg-[#FF8A00] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#E67700]">
                          Kirim Proposal Kolaborasi
                        </button>
                      )}
                      <p className="mt-2 text-center text-[11px] text-[#94A3B8]">AI Match hanya rekomendasi. Kolaborasi dibuat setelah kamu menekan tombol di atas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* POPUP — Sekolah mengundang UMKM (pesan + harga penawaran disesuaikan untuk sekolah) */}
      {showModal && pendingUmkm && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup" onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#0B2340]/60 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#EEF2F7] px-6 py-4">
              <h3 className="text-[16px] font-old text-[#0B2340]">Kirim Proposal Kolaborasi</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Kamu akan mengundang <span className="font-semibold text-[#0B2340]">{pendingUmkm.business_name}</span> ke <span className="font-semibold text-[#0B2340]">{selectedEvent.name}</span> · {selectedEvent.location} · Booth {fmtRp(selectedEvent.booth_price)}. Tulis pesan undangan dan harga yang kamu tawarkan — UMKM akan meninjau sebelum menerima.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Pesan untuk UMKM <span className="font-normal text-[#94A3B8]">(opsional, maks 2000)</span></span>
                <textarea value={modalMessage} onChange={(e) => setModalMessage(e.target.value)} maxLength={2000} rows={4} placeholder="Contoh: Halo Kreasi Lokal, kami dari SMKN 26 mengundang usaha kamu di Festival Budaya. Cocok dengan kategori & target Pelajar kami..." className="mt-1 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                <span className="mt-1 block text-right text-[11px] text-[#94A3B8]">{modalMessage.length}/2000</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Harga Booth yang Ditawarkan <span className="font-normal text-[#94A3B8]">(opsional, Rp — kosongkan jika ikut harga event)</span></span>
                <input value={modalPrice} onChange={(e) => setModalPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="mis. 450000" className="mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                {modalPrice && <span className="mt-1 block text-xs text-[#64748B]">≈ {fmtRp(Number(modalPrice))} {Number(modalPrice) !== Number(selectedEvent.booth_price) ? `(harga event ${fmtRp(selectedEvent.booth_price)})` : ""}</span>}
                <span className="mt-1 block text-[11px] text-[#94A3B8]">UMKM akan melihat harga ini di negosiasi. Kosongkan untuk pakai harga booth event.</span>
              </label>
              {proposalMsg?.type === "error" && <p className="text-xs text-red-600">{proposalMsg.text}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-6 py-4">
              <button type="button" onClick={() => setShowModal(false)} disabled={sendingId != null} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-60">Batal</button>
              <button type="button" onClick={handleConfirmInvite} disabled={sendingId != null} className="rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#E67700] disabled:opacity-60">
                {sendingId != null ? "Mengirim..." : "Kirim Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
