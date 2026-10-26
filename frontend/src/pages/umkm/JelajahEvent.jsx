import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCalendar, FiDollarSign, FiX } from "react-icons/fi";
import { LuStore, LuSparkles, LuCalendarDays } from "react-icons/lu";
import UmkmNavbar from "../../components/layout/UmkmNavbar";
import { useEvents } from "../../features/event-discovery/useEvents";
import { getEventImage } from "../../utils/umkmImage";
import { applyToEvent } from "../../features/ai-match/matchApi";

const CATEGORIES = ["Makanan", "Minuman", "Kerajinan", "Aksesoris", "Fashion"];
const LOCATIONS = ["Jakarta Timur", "Jakarta Selatan", "Jakarta Barat", "Jakarta Pusat", "Jakarta Utara"];

const CATEGORY_DOT = {
  Makanan: "bg-[#F59E0B]",
  Minuman: "bg-[#06B6D4]",
  Kerajinan: "bg-[#8B5CF6]",
  Aksesoris: "bg-[#EC4899]",
  Fashion: "bg-[#1677C8]",
};

function fmtDate(s) {
  if (!s) return "-";
  try { return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); } catch { return s; }
}
function fmtRp(n) { return "Rp" + Number(n || 0).toLocaleString("id-ID"); }

export default function JelajahEvent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const apiParams = useMemo(() => {
    const p = { limit: 12 };
    if (search.trim()) p.search = search.trim();
    if (category) p.category = category;
    if (location) p.location = location;
    if (maxPrice) p.max_booth_price = maxPrice;
    return p;
  }, [search, category, location, maxPrice]);

  const { events, isLoading, error, reload } = useEvents(apiParams);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState(null);

  const openModal = (ev) => {
    setSelectedEvent(ev);
    setModalMessage(`Halo, saya tertarik mendaftar sebagai tenant di ${ev.name}. Mohon informasinya, terima kasih!`);
    setModalPrice("");
    setApplyMsg(null);
    setShowModal(true);
  };

  const handleApply = async () => {
    if (!selectedEvent) return;
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
      await applyToEvent(selectedEvent.id, { message: modalMessage.trim() || null, proposed_price: priceNum });
      setShowModal(false);
      setApplyMsg(null);
      reload(apiParams);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.message?.[0] || "Gagal mendaftar. Coba lagi.";
      setApplyMsg({ type: "error", text: msg });
    } finally { setApplying(false); }
  };

  const resetFilter = () => { setSearch(""); setCategory(""); setLocation(""); setMaxPrice(""); };
  const hasActiveFilter = Boolean(search.trim() || category || location || maxPrice);
  const activeFilterCount = [category, location, maxPrice].filter(Boolean).length + (search.trim() ? 1 : 0);

  const displayEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter((ev) => {
      // 1. Search filter
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const nameMatch = ev.name?.toLowerCase().includes(q);
        const descMatch = ev.description?.toLowerCase().includes(q);
        const locMatch = ev.location?.toLowerCase().includes(q);
        const schoolMatch = (ev.school?.name || ev.school_name || "")
          .toLowerCase()
          .includes(q);
        if (!nameMatch && !descMatch && !locMatch && !schoolMatch) return false;
      }

      // 2. Category filter
      if (category) {
        const cats = ev.categories || (ev.category ? [ev.category] : []);
        const hasCat = ev.category === category || cats.includes(category);
        if (!hasCat) return false;
      }

      // 3. Location filter
      if (location) {
        const evLoc = (ev.location || "").toLowerCase();
        const reqLoc = location.toLowerCase();
        if (!evLoc.includes(reqLoc) && !reqLoc.includes(evLoc)) return false;
      }

      // 4. Max booth price filter
      if (maxPrice) {
        const limitP = Number(maxPrice);
        if (ev.booth_price && Number(ev.booth_price) > limitP) return false;
      }

      return true;
    });
  }, [events, search, category, location, maxPrice]);

  const heroPreview = displayEvents.length > 0 ? displayEvents.slice(0, 2) : events.slice(0, 2);

  return (
    <div className="min-h-screen font-sans text-[#111827]">
      <UmkmNavbar />

      <main className="relative overflow-hidden">
        {/* dot grid — sama kayak SchoolApplications */}
        <div className="pointer-events-none absolute right-10 top-10 hidden opacity-40 lg:block">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-[#9CA3AF]" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10">
          {/* HERO — clean kayak EventSaya / SchoolApplications */}
          <section className="grid gap-6 md:grid-cols-[1.45fr_1fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
                <LuStore size={13} className="text-[#FF8A00]" />
                <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">JELAJAH EVENT · Kurasi untuk UMKM</span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#0B2340] md:text-[40px]">
                Jelajahi event
                <br />
                <span className="text-[#1677C8]">yang pas buat usahamu.</span>
              </h1>
              <p className="mt-3 max-w-[540px] text-sm leading-6 text-[#64748B]">
                Semua event aktif dari sekolah — filter by kategori, lokasi, dan budget booth. Mau yang dipersonalisasi?
                <Link to="/umkm/ai-match/hasil" className="ml-1 inline-flex items-center gap-1 font-semibold text-[#1677C8] hover:underline">
                  Coba AI Match <LuSparkles size={12} />
                </Link>
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-[#0B2340] ring-1 ring-[#E2E8F0]">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                  {isLoading ? "Memuat…" : `${displayEvents.length} event aktif`}
                </span>
                {hasActiveFilter && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 font-medium text-[#64748B]">
                    {activeFilterCount} filter aktif
                  </span>
                )}
                <Link to="/umkm/applications" className="hidden items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 font-medium text-[#64748B] hover:border-[#1677C8] hover:text-[#1677C8] md:inline-flex">
                  Lamaran Saya →
                </Link>
              </div>
            </div>

            {/* preview card — clean, bukan foto full */}
            <div className="relative hidden md:block">
              <div className="relative overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-3 shadow-sm">
                <div className="absolute -right-2 -top-2 hidden h-16 w-16 opacity-20 lg:block">
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span key={i} className="h-1 w-1 rounded-full bg-[#94A3B8]" />
                    ))}
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-[#EEF2F7]">
                  {heroPreview[0] ? (
                    <img src={getEventImage(heroPreview[0])} alt="" className="h-[128px] w-full object-cover" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="" className="h-[128px] w-full object-cover" />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-[#FF8A00] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">POPULER</span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#0B2340] backdrop-blur">
                    {heroPreview[0]?.school?.name || heroPreview[0]?.school_name || "SMK • Event Pilihan"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-bold text-[#0B2340]">{heroPreview[0]?.name || "Festival Budaya & Market Day"}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1"><FiCalendar size={11} /> {heroPreview[0] ? fmtDate(heroPreview[0].event_date) : "21 Nov 2026"}</span>
                    <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />
                    <span className="inline-flex items-center gap-1"><FiMapPin size={11} /> {heroPreview[0]?.location || "Jakarta Timur"}</span>
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2340]">{heroPreview[0] ? fmtRp(heroPreview[0].booth_price) : "Rp450.000"} <span className="font-normal text-[#94A3B8]">/ booth</span></span>
                    <Link to="/umkm/ai-match/hasil" className="inline-flex items-center gap-1 rounded-full bg-[#0B2340] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#123A6B]">
                      AI Match <LuSparkles size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FILTER — kartu putih floating */}
          <div className="mt-8 rounded-2xl border border-[#E6ECF3] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-[520px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <FiSearch size={18} />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari event atau nama sekolah..."
                  className="h-11 w-full rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-10 text-sm text-[#0B294D] placeholder:text-[#94A3B8] outline-none focus:border-[#1677C8] focus:bg-white"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 text-[#94A3B8] ring-1 ring-[#E2E8F0] hover:text-[#0B2340]">
                    <FiX size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-medium text-[#94A3B8] md:inline">
                  {!isLoading ? `${displayEvents.length} event` : "Memuat…"}
                </span>
                {hasActiveFilter && (
                  <button type="button" onClick={resetFilter} className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0B2340]">
                    <FiX size={13} /> Reset
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] md:inline-flex">Kategori</span>
              <button
                type="button"
                onClick={() => setCategory("")}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${!category ? "border-[#0B2340] bg-[#0B2340] text-white shadow" : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0B2340]"}`}
              >
                Semua
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory((prev) => (prev === c ? "" : c))}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${category === c ? "border-[#1677C8] bg-[#1677C8] text-white shadow" : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0B2340]"}`}
                >
                  <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[c] || "bg-[#CBD5E1]"}`} />
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#EEF2F7] pt-3">
              <span className="mr-1 hidden items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] md:inline-flex">Filter</span>
              <div className="relative">
                <FiMapPin size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="h-8 appearance-none rounded-full border border-[#E2E8F0] bg-white pl-7 pr-7 text-xs font-medium text-[#0B2340] outline-none focus:border-[#1677C8]">
                  <option value="">Semua Lokasi</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="relative">
                <FiDollarSign size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-8 appearance-none rounded-full border border-[#E2E8F0] bg-white pl-7 pr-7 text-xs font-medium text-[#0B2340] outline-none focus:border-[#1677C8]">
                  <option value="">Semua Harga</option>
                  <option value="300000">≤ Rp300.000</option>
                  <option value="400000">≤ Rp400.000</option>
                  <option value="500000">≤ Rp500.000</option>
                  <option value="600000">≤ Rp600.000</option>
                </select>
              </div>
              <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-[#94A3B8] md:inline-flex">
                <LuSparkles size={12} className="text-[#1677C8]" /> Tip: pakai AI Match untuk hasil yang dipersonalisasi
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <section className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm">
                    <div className="h-[168px] animate-pulse bg-[#EEF2F7]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#EEF2F7]" />
                      <div className="h-3 w-full animate-pulse rounded bg-[#F1F5F9]" />
                      <div className="h-8 w-full animate-pulse rounded-full bg-[#F1F5F9]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">{error}</div>
            ) : displayEvents.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm">
                <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                  <div className="px-6 py-10 md:px-8 md:py-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF6FF] text-[#1677C8]">
                      <LuCalendarDays size={22} />
                    </div>
                    <h3 className="mt-4 text-[18px] font-bold tracking-tight text-[#0B2340]">Belum ada event yang cocok</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">Coba ubah kata kunci atau filter. Event yang masih draft tidak ditampilkan di Jelajah Event.</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {hasActiveFilter && (
                        <button type="button" onClick={resetFilter} className="rounded-full bg-[#0B2340] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#123A6B]">Reset filter</button>
                      )}
                      <Link to="/umkm/ai-match/hasil" className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-xs font-bold text-[#0B2340] hover:border-[#1677C8] hover:text-[#1677C8]">
                        <LuSparkles size={12} /> Coba AI Match
                      </Link>
                    </div>
                  </div>
                  <div className="relative hidden overflow-hidden bg-[#F8FAFD] p-6 md:block">
                    <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                    <div className="relative rounded-2xl border border-[#E6ECF3] bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8]">
                        <span className="h-2 w-2 rounded-full bg-[#CBD5E1]" /> Contoh event
                      </div>
                      <div className="mt-3 h-24 rounded-xl bg-[#EEF2F7]" />
                      <div className="mt-3 h-4 w-2/3 rounded bg-[#EEF2F7]" />
                      <div className="mt-2 h-3 w-full rounded bg-[#F1F5F9]" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF8A00]">Daftar Event</p>
                    <h2 className="mt-1 text-[18px] font-bold tracking-tight text-[#0B2340] md:text-[20px]">
                      {hasActiveFilter ? "Hasil pencarian" : "Event terbaru"}
                      <span className="ml-2 align-middle text-xs font-medium text-[#94A3B8]">· {displayEvents.length} event</span>
                    </h2>
                  </div>
                  <Link to="/umkm/ai-match/hasil" className="hidden items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2340] hover:border-[#1677C8] hover:text-[#1677C8] md:inline-flex">
                    <LuSparkles size={12} className="text-[#1677C8]" /> AI Match
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {displayEvents.map((ev) => {
                    const img = getEventImage(ev);
                    const cats = ev.categories || (ev.category ? [ev.category] : []);
                    const primaryCat = cats[0] || "Makanan";
                    return (
                      <article
                        key={ev.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#C9D9EF] hover:shadow-[0_10px_30px_rgba(11,35,64,0.08)]"
                      >
                        <div className="relative h-[172px] overflow-hidden bg-[#EEF2F7]">
                          <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                          <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0B2340] shadow backdrop-blur">
                              <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[primaryCat] || "bg-[#94A3B8]"}`} />
                              {primaryCat}
                            </span>
                            <span className="hidden rounded-full bg-[#0B2340]/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur md:inline-flex">
                              {ev.school?.name || ev.school_name || "Sekolah"}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                            {cats.slice(0, 3).map((c) => (
                              <span key={c} className={`rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${c === primaryCat ? "bg-white text-[#0B2340]" : "bg-white/80 text-[#334155]"}`}>
                                {c}
                              </span>
                            ))}
                          </div>
                          <div className="absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B2340] shadow md:inline-flex">
                            <FiCalendar size={11} className="text-[#1677C8]" /> {fmtDate(ev.event_date)}
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="line-clamp-1 text-[15px] font-bold leading-tight text-[#0B2340] group-hover:text-[#1677C8]">{ev.name}</h3>
                          <p className="mt-1.5 line-clamp-2 min-h-[32px] text-xs leading-5 text-[#64748B]">
                            {ev.description || "Event kolaborasi sekolah dan UMKM — buka booth dan jangkau pengunjung baru."}
                          </p>
                          <div className="mt-3 grid grid-cols-3 gap-2 border-y border-[#EEF2F7] py-3">
                            <div>
                              <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]"><FiCalendar size={10} /> Tanggal</p>
                              <p className="mt-1 text-xs font-semibold text-[#0B2340]">{fmtDate(ev.event_date)}</p>
                            </div>
                            <div>
                              <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]"><FiMapPin size={10} /> Lokasi</p>
                              <p className="mt-1 truncate text-xs font-semibold text-[#0B2340]">{ev.location}</p>
                            </div>
                            <div>
                              <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]"><LuStore size={10} /> Booth</p>
                              <p className="mt-1 text-xs font-semibold text-[#0B2340]">{ev.booth_capacity} slot</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Harga Booth</p>
                              <p className="mt-0.5 text-[15px] font-extrabold leading-none text-[#0B2340]">{fmtRp(ev.booth_price)}</p>
                              <p className="text-[11px] text-[#94A3B8]">per booth · negosiasi tersedia</p>
                            </div>
                          </div>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] translate-y-full bg-[#1677C8] transition group-hover:translate-y-0" />
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup" onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#0B2340]/60 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#EEF2F7] px-6 py-4">
              <h3 className="text-[16px] font-extrabold text-[#0B2340]">Kirim Pendaftaran</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                Kamu akan mendaftar di <span className="font-semibold text-[#0B2340]">{selectedEvent.name}</span> · {selectedEvent.school?.name || selectedEvent.school_name || ""} · Booth {fmtRp(selectedEvent.booth_price)}.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Pesan untuk Sekolah <span className="font-normal text-[#94A3B8]">(opsional, maks 2000)</span></span>
                <textarea value={modalMessage} onChange={(e) => setModalMessage(e.target.value)} maxLength={2000} rows={4} placeholder="Halo, saya tertarik mendaftar..." className="mt-1 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                <span className="mt-1 block text-right text-[11px] text-[#94A3B8]">{modalMessage.length}/2000</span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-[#0B294D]">Harga Penawaran <span className="font-normal text-[#94A3B8]">(opsional — kosongkan jika ikut harga booth)</span></span>
                <input value={modalPrice} onChange={(e) => setModalPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="mis. 350000" className="mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0B2340] placeholder:text-[#94A3B8] outline-none focus:border-[#1677FF]" />
                {modalPrice && <span className="mt-1 block text-xs text-[#64748B]">≈ {fmtRp(Number(modalPrice))}</span>}
              </label>
              {applyMsg?.type === "error" && <p className="text-xs text-red-600">{applyMsg.text}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#EEF2F7] bg-[#F8FAFD] px-6 py-4">
              <button type="button" onClick={() => setShowModal(false)} disabled={applying} className="rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-60">Batal</button>
              <button type="button" onClick={handleApply} disabled={applying} className="rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#E67700] disabled:opacity-60">
                {applying ? "Mengirim..." : "Kirim Pendaftaran"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
