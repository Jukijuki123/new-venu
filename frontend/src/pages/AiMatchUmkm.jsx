import { useEffect, useState, useMemo } from "react";
import { useUmkmMatches } from "../features/ai-match/useUmkmMatches";
import { applyToEvent } from "../features/ai-match/matchApi";
import UmkmNavbar from "../components/layout/UmkmNavbar";
import { useAuth } from "../context/useAuth";
import { getEventImage } from "../utils/umkmImage";
import { FiSearch } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { Link } from "react-router-dom";

function formatDateRange(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
}
function fmtRp(n) {
  if (n == null) return "-";
  return "Rp" + Number(n).toLocaleString("id-ID");
}

export default function AiMatchUmkm() {
  const { user } = useAuth();
  const { matches, isLoading, error, reload } = useUmkmMatches();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("");
  const [filterHarga, setFilterHarga] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState(null);
  const [boothChoice, setBoothChoice] = useState("standar");
  const [needs, setNeeds] = useState({ meja: true, listrik: true, wifi: true, keamanan: true, lainnya: false });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalPrice, setModalPrice] = useState("");

  const filtered = useMemo(() => {
    let list = matches;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name?.toLowerCase().includes(q) || m.school_name?.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q));
    }
    if (filterLokasi) list = list.filter((m) => (m.location || "").toLowerCase().includes(filterLokasi.toLowerCase()));
    if (filterHarga) {
      const max = Number(filterHarga);
      if (!Number.isNaN(max)) list = list.filter((m) => Number(m.booth_price) <= max);
    }
    return list;
  }, [matches, search, filterLokasi, filterHarga]);

  const selected = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.find((m) => m.event_id === selectedId) ?? filtered[0];
  }, [filtered, selectedId]);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const openModal = () => {
    if (!selected || selected.application_status) return;
    setModalMessage(`Halo, saya tertarik mendaftar sebagai tenant di ${selected.name}. Mohon informasinya, terima kasih!`);
    setModalPrice("");
    setApplyMsg(null);
    setShowModal(true);
  };

  const handleConfirmApply = async () => {
    if (!selected) return;
    const priceNum = modalPrice.trim() === "" ? null : Number(modalPrice.replace(/\D/g, ""));
    if (modalPrice.trim() !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      setApplyMsg({ type: "error", text: "Harga penawaran harus angka positif." });
      return;
    }
    if (modalMessage.length > 2000) {
      setApplyMsg({ type: "error", text: "Pesan maksimal 2000 karakter." });
      return;
    }
    setApplying(true);
    setApplyMsg(null);
    try {
      await applyToEvent(selected.event_id, {
        message: modalMessage.trim() || null,
        proposed_price: priceNum,
      });
      setShowModal(false);
      setApplyMsg({ type: "success", text: "Pendaftaran terkirim! Menunggu review sekolah." });
      reload();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.message?.[0] || "Gagal mendaftar. Coba lagi.";
      setApplyMsg({ type: "error", text: msg });
    } finally { setApplying(false); }
  };

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
          {/* HERO — clean */}
          <section className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
              <LuSparkles size={14} className="text-[#1677C8]" />
              <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">AI MATCH · Rekomendasi personal</span>
            </div>
            <h1 className="text-4xl font-bold leading-[0.95] tracking-[-2px] text-[#111827] md:text-5xl">
              Rekomendasi event
              <br />
              <span className="text-[#1677C8]">yang paling cocok untukmu.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6B7280]">
              AI menganalisis kategori, lokasi, budget booth, dan target audiens usahamu. Hasil diurutkan dari yang paling relevan.
            </p>
          </section>

          {/* FILTER — kartu putih */}
          <div className="mt-8 rounded-2xl border border-[#E6ECF3] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-[520px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <FiSearch size={18} />
                </span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari event, sekolah, atau kategori..." className="h-11 w-full rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-4 text-sm text-[#0B294D] placeholder:text-[#94A3B8] outline-none focus:border-[#1677C8] focus:bg-white" />
              </div>
              <p className="hidden shrink-0 items-center gap-1.5 text-xs text-[#94A3B8] md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" /> {filtered.length} event ditemukan
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => { setFilterLokasi(""); setFilterHarga(""); }} className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${!filterLokasi && !filterHarga ? "border-[#1677FF] bg-[#EEF6FF] text-[#1677FF]" : "border-[#E2E8F0] bg-white text-[#64748B]"}`}>
                Semua Event
              </button>
              <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-medium text-[#64748B] outline-none">
                <option value="">Semua Lokasi</option>
                <option value="Jakarta Timur">Jakarta Timur</option>
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Jakarta Barat">Jakarta Barat</option>
                <option value="Jakarta Pusat">Jakarta Pusat</option>
                <option value="Jakarta Utara">Jakarta Utara</option>
              </select>
              <select value={filterHarga} onChange={(e) => setFilterHarga(e.target.value)} className="rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-medium text-[#64748B] outline-none">
                <option value="">Semua Harga</option>
                <option value="300000">≤ Rp300.000</option>
                <option value="400000">≤ Rp400.000</option>
                <option value="500000">≤ Rp500.000</option>
                <option value="600000">≤ Rp600.000</option>
              </select>
              <Link to="/umkm/events" className="ml-auto hidden items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2340] hover:border-[#1677C8] hover:text-[#1677C8] md:inline-flex">
                Jelajah Event →
              </Link>
            </div>
            {applyMsg && <p className={`mt-3 text-xs ${applyMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{applyMsg.text}</p>}
          </div>

          {/* CONTENT */}
          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
                <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-[118px] animate-pulse rounded-2xl border border-[#E6ECF3] bg-white" />)}</div>
                <div className="h-[520px] animate-pulse rounded-2xl border border-[#E6ECF3] bg-white" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center">
                <p className="text-sm font-semibold text-[#0B294D]">Belum ada event yang cocok</p>
                <p className="mt-1 text-sm text-[#94A3B8]">Coba ubah filter atau lengkapi profil UMKM supaya rekomendasi lebih akurat.</p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:items-start">
                <div className="space-y-3">
                  {filtered.map((m) => {
                    const active = selected?.event_id === m.event_id;
                    const img = getEventImage(m);
                    return (
                      <button key={m.event_id} type="button" onClick={() => setSelectedId(m.event_id)} className={`group flex w-full gap-3.5 overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm transition ${active ? "border-[#1677FF] ring-1 ring-[#1677FF]/20" : "border-[#E6ECF3] hover:border-[#C9D9EF]"}`}>
                        <div className="relative h-[92px] w-[112px] shrink-0 overflow-hidden rounded-xl bg-[#EEF2F7]">
                          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                          <span className="absolute right-1.5 top-1.5 rounded-full bg-[#1677FF] px-2 py-0.5 text-[10px] font-bold text-white shadow">{m.match_score}% Cocok</span>
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <h3 className="truncate text-[15px] font-bold leading-tight text-[#0B294D]">{m.name}</h3>
                          <p className="mt-0.5 text-xs text-[#64748B]">{m.school_name}</p>
                          <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] leading-none text-[#94A3B8]">
                            <span className="inline-flex items-center gap-1">{formatDateRange(m.event_date)}</span>
                            <span>· {m.location}</span>
                            <span>· {m.booth_capacity} slot</span>
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(m.categories || [m.category]).slice(0, 3).map((c) => (
                              <span key={c} className="rounded-full bg-[#EEF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1677FF]">{c}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm">
                    {/* header detail — clean, bukan foto full */}
                    <div className="border-b border-[#EEF2F7] p-5">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EEF2F7]">
                          <img src={getEventImage(selected)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-[16px] font-extrabold leading-tight text-[#0B2340]">{selected.name}</h2>
                          <p className="mt-1 text-xs text-[#64748B]">{selected.school_name} · {formatDateRange(selected.event_date)} · {selected.location}</p>
                          <p className="mt-1 text-xs text-[#94A3B8]">{selected.booth_capacity} slot booth · {fmtRp(selected.booth_price)} / booth</p>
                        </div>
                        <div className="hidden shrink-0 flex-col items-center md:flex">
                          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-[3px] border-[#1677FF] bg-white text-sm font-extrabold text-[#0B2340]">{selected.match_score}%</div>
                          <span className="mt-1 text-[10px] font-semibold text-[#64748B]">Cocok untukmu</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between md:hidden">
                        <span className="text-xs font-semibold text-[#64748B]">Kecocokan</span>
                        <span className="rounded-full bg-[#1677FF] px-3 py-1 text-xs font-bold text-white">{selected.match_score}% Cocok</span>
                      </div>
                    </div>

                    <div className="border-b border-[#EEF2F7] px-5 py-4">
                      <div className="flex items-center gap-2">
                        {[
                          { n: 1, label: "Pilih Booth", active: true },
                          { n: 2, label: "Kebutuhan", active: false },
                          { n: 3, label: "Data Usaha", active: false },
                          { n: 4, label: "Dokumen", active: false },
                        ].map((s, i) => (
                          <div key={s.n} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${s.active ? "bg-[#1677FF] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}>{s.n}</span>
                              <span className={`hidden text-xs font-semibold md:inline ${s.active ? "text-[#1677FF]" : "text-[#94A3B8]"}`}>{s.label}</span>
                            </div>
                            {i < 3 && <span className="mx-1 h-px w-6 bg-[#E2E8F0] md:w-8" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-5 py-5 md:px-6">
                      <p className="text-xs text-[#64748B]">Pilih ukuran booth yang sesuai dengan kebutuhan usahamu.</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <button type="button" onClick={() => setBoothChoice("standar")} className={`relative flex items-center justify-between rounded-xl border p-4 text-left ${boothChoice === "standar" ? "border-[#1677FF] bg-[#EEF6FF]" : "border-[#E2E8F0] bg-white"}`}>
                          <div>
                            <p className="text-sm font-bold text-[#0B294D]">Booth Standar</p>
                            <p className="text-xs text-[#94A3B8]">(3 x 2 meter)</p>
                            <p className="mt-2 text-sm font-extrabold text-[#0B294D]">{fmtRp(selected.booth_price)}</p>
                          </div>
                          <span className="text-2xl" aria-hidden>🏪</span>
                          {boothChoice === "standar" && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1677FF]" />}
                        </button>
                        <button type="button" onClick={() => setBoothChoice("premium")} className={`relative flex items-center justify-between rounded-xl border p-4 text-left ${boothChoice === "premium" ? "border-[#1677FF] bg-[#EEF6FF]" : "border-[#E2E8F0] bg-white"}`}>
                          <div>
                            <p className="text-sm font-bold text-[#0B294D]">Booth Premium</p>
                            <p className="text-xs text-[#94A3B8]">(5 x 2 meter)</p>
                            <p className="mt-2 text-sm font-extrabold text-[#0B294D]">{fmtRp(Number(selected.booth_price) + 200000)}</p>
                          </div>
                          <span className="text-2xl opacity-60" aria-hidden>🏬</span>
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] text-[#94A3B8]">Harga sesuai data event. Varian Premium ilustratif (+Rp200.000) — total yang ditagihkan tetap harga booth event.</p>

                      <h3 className="mt-6 text-sm font-bold text-[#0B294D]">Kebutuhan Booth <span className="font-normal text-[#94A3B8]">(opsional)</span></h3>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {[
                          ["meja", "Meja & Kursi"],
                          ["listrik", "Listrik"],
                          ["wifi", "Wi-Fi"],
                          ["keamanan", "Keamanan"],
                          ["lainnya", "Lainnya"],
                        ].map(([key, label]) => (
                          <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-[#334155]">
                            <input type="checkbox" checked={needs[key]} onChange={(e) => setNeeds((s) => ({ ...s, [key]: e.target.checked }))} className="h-4 w-4 rounded border-[#CBD5E1] text-[#1677FF]" />
                            {label}
                          </label>
                        ))}
                      </div>

                      <h3 className="mt-6 text-sm font-bold text-[#0B294D]">Data Usaha</h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-medium text-[#64748B]">Nama Usaha</span>
                          <input value={user?.name || "-"} readOnly className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] px-3 text-sm text-[#0B294D]" />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium text-[#64748B]">Kategori Usaha</span>
                          <input value={selected.category || "-"} readOnly className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] px-3 text-sm text-[#0B294D]" />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium text-[#64748B]">Kontak Person</span>
                          <input value={user?.name || "-"} readOnly className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFD] px-3 text-sm text-[#0B294D]" />
                        </label>
                        <label className="block">
                          <span className="text-xs font-medium text-[#64748B]">No. WhatsApp</span>
                          <input placeholder="08xxxxxxxxxx" className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm outline-none focus:border-[#1677FF]" />
                        </label>
                      </div>

                      <div className="mt-6 rounded-xl bg-[#F8FAFD] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-[#0B294D]">Kenapa Cocok?</p>
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

                      <div className="mt-6 flex flex-col gap-3 border-t border-[#EEF2F7] pt-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs text-[#64748B]">Total Biaya:</p>
                          <p className="text-lg font-extrabold text-[#0B2340]">{fmtRp(selected.booth_price)}</p>
                          <p className="text-[11px] italic text-[#94A3B8]">*Biaya dapat berubah sesuai keputusan sekolah.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {selected.application_status ? (
                            <span className="rounded-full bg-[#EEF2F7] px-6 py-3 text-center text-sm font-semibold text-[#64748B]">Status: {selected.application_status}</span>
                          ) : (
                            <button type="button" onClick={openModal} className="rounded-full bg-[#FF8A00] px-8 py-3 text-sm font-bold text-white shadow hover:bg-[#E67700]">
                              Kirim Pendaftaran
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup" onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#0B2340]/60 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#EEF2F7] px-6 py-4">
              <h3 className="text-[16px] font-extrabold text-[#0B2340]">Kirim Pendaftaran</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Kamu akan mendaftar sebagai tenant di <span className="font-semibold text-[#0B2340]">{selected.name}</span> · {selected.school_name} · Booth {fmtRp(selected.booth_price)}.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Pesan untuk Sekolah <span className="font-normal text-[#94A3B8]">(opsional, maks 2000)</span></span>
                <textarea value={modalMessage} onChange={(e) => setModalMessage(e.target.value)} maxLength={2000} rows={4} placeholder="Contoh: Halo, saya dari Kreasi Lokal ingin menawarkan produk kerajinan yang cocok untuk audience Pelajar..." className="mt-1 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                <span className="mt-1 block text-right text-[11px] text-[#94A3B8]">{modalMessage.length}/2000</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Harga Penawaran <span className="font-normal text-[#94A3B8]">(opsional — kosongkan jika ikut harga booth)</span></span>
                <input value={modalPrice} onChange={(e) => setModalPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="mis. 350000" className="mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                {modalPrice && <span className="mt-1 block text-xs text-[#64748B]">≈ {fmtRp(Number(modalPrice))} {Number(modalPrice) !== Number(selected.booth_price) ? `(harga booth ${fmtRp(selected.booth_price)})` : ""}</span>}
              </label>
              {applyMsg?.type === "error" && <p className="text-xs text-red-600">{applyMsg.text}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-6 py-4">
              <button type="button" onClick={() => setShowModal(false)} disabled={applying} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-60">Batal</button>
              <button type="button" onClick={handleConfirmApply} disabled={applying} className="rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#E67700] disabled:opacity-60">
                {applying ? "Mengirim..." : "Kirim Pendaftaran"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
