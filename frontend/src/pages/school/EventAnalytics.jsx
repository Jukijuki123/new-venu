import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiX,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import {
  LuStore,
  LuMegaphone,
  LuInbox,
  LuTrendingUp,
  LuSparkles,
  LuUsers,
} from "react-icons/lu";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import { useMyEvents } from "../../features/event-management/useMyEvents";
import { useEventAnalytics } from "../../features/event-management/useEventAnalytics";

/* ─── Formatters ──────────────────────────────────────────────── */
function formatDate(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

/* ─── Donut Chart (pure SVG) ──────────────────────────────────── */
function DonutChart({ data, size = 180 }) {
  const allValues = Object.values(data).reduce((s, v) => s + v, 0);
  if (allValues === 0) return null;

  const COLORS = ["#16A34A", "#F59E0B", "#EF4444"];
  const keys = Object.keys(data);
  const values = Object.values(data);

  let startAngle = -90;
  const slices = values.map((v, i) => {
    const pct = v / allValues;
    const endAngle = startAngle + pct * 360;
    const x1 = Math.cos((startAngle * Math.PI) / 180);
    const y1 = Math.sin((startAngle * Math.PI) / 180);
    const x2 = Math.cos((endAngle * Math.PI) / 180);
    const y2 = Math.sin((endAngle * Math.PI) / 180);
    const large = pct > 0.5 ? 1 : 0;
    startAngle = endAngle;
    return { color: COLORS[i], x1, y1, x2, y2, large, pct, value: v, key: keys[i] };
  });

  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.68;
  const strokeW = size * 0.14;

  const toArc = ({ x1, y1, x2, y2, large }) =>
    `M ${cx + x1 * r} ${cy + y1 * r} A ${r} ${r} 0 ${large} 1 ${cx + x2 * r} ${cy + y2 * r}`;

  const LABELS = [
    { key: "approved", label: "Diterima", color: "#16A34A" },
    { key: "pending", label: "Menunggu", color: "#F59E0B" },
    { key: "rejected", label: "Ditolak", color: "#EF4444" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={strokeW} />
        {/* Slices */}
        {slices.map((s, i) => (
          <path
            key={i}
            d={toArc(s)}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
          />
        ))}
        {/* Center label */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="fill-[#0B2340]"
          style={{ fontSize: size * 0.16, fontWeight: 800, fontFamily: "inherit" }}
        >
          {allValues}
        </text>
        <text
          x={cx}
          y={cy + size * 0.07}
          textAnchor="middle"
          className="fill-[#94A3B8]"
          style={{ fontSize: size * 0.07, fontWeight: 600, fontFamily: "inherit" }}
        >
          Proposal
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {LABELS.map((l) => (
          <div key={l.key} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-xs font-semibold text-[#64748B]">{l.label}</span>
            <span className="text-xs font-bold text-[#0B2340]">{data[l.key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Horizontal Bar (kategori) ──────────────────────────────── */
function CategoryBars({ categories }) {
  if (!categories || Object.keys(categories).length === 0) return null;

  const sorted = Object.entries(categories).sort(([, a], [, b]) => b - a);
  const max = sorted[0]?.[1] || 1;

  const COLORS = [
    "#1677C8", "#0EA5E9", "#06B6D4", "#14B8A6",
    "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  ];

  return (
    <div className="space-y-3">
      {sorted.map(([cat, count], i) => {
        const pct = Math.round((count / max) * 100);
        const color = COLORS[i % COLORS.length];
        return (
          <div key={cat}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0B2340]">{cat}</span>
              <span className="text-xs font-bold text-[#64748B]">{count} tenant</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#F1F5F9]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Progress Bar Booth ──────────────────────────────────────── */
function BoothProgress({ filled, capacity }) {
  const pct = capacity > 0 ? Math.round((filled / capacity) * 100) : 0;
  const empty = Math.max(capacity - filled, 0);

  return (
    <div>
      <div className="mb-3">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-[-1px] text-[#0B2340]">
            {filled}
            <span className="text-base font-semibold text-[#94A3B8]">/{capacity}</span>
          </span>
          <span className="text-sm font-bold text-[#1677C8]">{pct}%</span>
        </div>
        <p className="mt-0.5 text-xs text-[#94A3B8]">{filled} booth terisi</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1677C8] to-[#0EA5E9] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[#16A34A]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#16A34A]" />
          Booth Terisi
        </span>
        <span className="font-bold text-[#16A34A]">{filled}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[#CBD5E1]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#E2E8F0]" />
          Booth Kosong
        </span>
        <span className="font-bold text-[#64748B]">{empty}</span>
      </div>
    </div>
  );
}

/* ─── Insight Card ───────────────────────────────────────────── */
const INSIGHT_TYPE_STYLE = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "✓",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "i",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    dot: "bg-blue-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "!",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    dot: "bg-amber-500",
  },
};

function InsightItem({ insight }) {
  const style = INSIGHT_TYPE_STYLE[insight.type] || INSIGHT_TYPE_STYLE.info;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${style.bg} ${style.border}`}
    >
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${style.iconBg} ${style.iconColor}`}
      >
        {style.icon}
      </div>
      <p className="text-sm font-medium leading-relaxed text-[#374151]">{insight.text}</p>
    </div>
  );
}

/* ─── Summary Card ───────────────────────────────────────────── */
function SummaryCard({ label, value, sub, icon: Icon, accent, iconBg, iconColor }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between p-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="px-5 text-2xl font-extrabold tracking-[-1px] text-[#0B2340]">{value}</p>
      <p className="mt-1 px-5 text-[11px] font-semibold text-[#64748B]">{label}</p>
      {sub && <p className="mb-4 px-5 text-[10px] text-[#94A3B8]">{sub}</p>}
      <div
        className="h-[3px] w-0 rounded-b-xl transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function EventAnalytics() {
  const { eventId } = useParams();
  const { events, isLoading: eventsLoading } = useMyEvents();
  const { analytics, isLoading, error } = useEventAnalytics(eventId);

  const event = useMemo(
    () => events.find((e) => String(e.id) === String(eventId)),
    [events, eventId]
  );

  /* ── Loading state ── */
  if (eventsLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 md:py-14">
          <div className="flex min-h-[500px] flex-col items-center justify-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#1677C8]" />
            <p className="text-sm text-[#9CA3AF]">Memuat analisis event...</p>
          </div>
        </main>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 md:py-14">
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/school/events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1677C8] transition hover:gap-2.5"
            >
              <FiArrowLeft size={16} />
              Kembali ke Event Saya
            </Link>
          </div>
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <FiX className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-red-700">Gagal memuat analisis</h3>
            <p className="mt-1 text-sm text-red-500">{error}</p>
            <Link
              to="/school/events"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FiArrowLeft size={14} />
              Kembali ke Event Saya
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /* ── Event not found ── */
  if (!event) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 md:py-14">
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAFAF9]">
              <LuInbox className="h-8 w-8 text-[#D1D5DB]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Event tidak ditemukan</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Event ini mungkin sudah dihapus.</p>
            <Link
              to="/school/events"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1268B2]"
            >
              <FiArrowLeft size={14} />
              Kembali ke Event Saya
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /* ── Analytics empty state ── */
  const hasData = analytics && analytics.total_applications > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
        <SchoolNavbar />
        <main className="mx-auto max-w-[1280px] px-5 py-6 md:px-8 md:py-10">
          {/* Back nav */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              to="/school/events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1677C8] transition hover:gap-2.5"
            >
              <FiArrowLeft size={16} />
              Kembali ke Event Saya
            </Link>
          </div>

          {/* Event header */}
          <div className="mb-2">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#EEF2F7] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#475569] shadow-sm">
              <LuSparkles size={12} className="text-[#FF8A00]" />
              Analisis Event
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0B2340] md:text-4xl">
              {event.name}
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">{event.school?.name}</p>
            <p className="mt-0.5 text-xs text-[#94A3B8]">
              {formatDate(event.event_date)} · {event.location}
            </p>
          </div>

          {/* Empty state */}
          <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6FF]">
              <FiBarChart2 className="h-8 w-8 text-[#1677C8]" />
            </div>
            <h3 className="text-lg font-bold text-[#0B2340]">Belum ada data analisis</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#64748B]">
              Analisis akan tersedia setelah ada tenant yang terdaftar atau proposal yang masuk untuk event ini.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={`/school/events/${eventId}/tenants`}
                className="inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1268B2]"
              >
                <LuStore size={14} />
                Kelola Tenant
              </Link>
              <Link
                to={`/school/applications?event=${eventId}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B2340] transition hover:border-[#1677C8] hover:text-[#1677C8]"
              >
                <FiBarChart2 size={14} />
                Lihat Lamaran
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const {
    total_applications,
    approved_applications,
    pending_applications,
    rejected_applications,
    booths_filled,
    booth_capacity,
    occupancy_rate,
    acceptance_rate,
    category_counts,
    dominant_category,
    location_counts,
    has_location_data,
    insights,
  } = analytics;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <SchoolNavbar />

      <main className="mx-auto max-w-[1280px] px-5 py-6 md:px-8 md:py-10">

        {/* ─── Top bar ─────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/school/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1677C8] transition hover:gap-2.5"
          >
            <FiArrowLeft size={16} />
            Kembali ke Event Saya
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#1677C8]" />
            <span className="text-[11px] font-semibold tracking-wide text-[#4B5563]">
              {event.name}
            </span>
          </div>
        </div>

        {/* ─── Page header ──────────────────────────────────── */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#EEF2F7] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#475569] shadow-sm">
            <LuSparkles size={12} className="text-[#FF8A00]" />
            Analisis Event
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0B2340] md:text-[42px]">
            {event.name}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#1677C8]">{event.school?.name}</p>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            {formatDate(event.event_date)} · {event.location}
          </p>
        </div>

        {/* ─── Summary Cards ─────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <SummaryCard
            label="Total Tenant"
            value={approved_applications}
            sub="tenant aktif"
            icon={LuUsers}
            accent="#1677C8"
            iconBg="bg-[#EFF6FF]"
            iconColor="text-[#1677C8]"
          />
          <SummaryCard
            label="Booth Terisi"
            value={`${booths_filled} / ${booth_capacity}`}
            sub={`${occupancy_rate}% terisi`}
            icon={LuStore}
            accent="#0EA5E9"
            iconBg="bg-[#E0F2FE]"
            iconColor="text-[#0EA5E9]"
          />
          <SummaryCard
            label="Total Proposal"
            value={total_applications}
            sub="pengajuan masuk"
            icon={LuMegaphone}
            accent="#8B5CF6"
            iconBg="bg-[#F5F3FF]"
            iconColor="text-[#8B5CF6]"
          />
          <SummaryCard
            label="Tingkat Penerimaan"
            value={`${acceptance_rate}%`}
            sub={`${approved_applications} diterima`}
            icon={FiTrendingUp}
            accent="#16A34A"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </section>

        {/* ─── Performa Booth + Status Proposal ─────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Booth Performance */}
          <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF]">
                <LuTrendingUp size={18} className="text-[#1677C8]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2340]">Performa Booth</p>
                <p className="text-[11px] text-[#94A3B8]">Keterisian booth event ini</p>
              </div>
            </div>
            <BoothProgress filled={booths_filled} capacity={booth_capacity} />
          </div>

          {/* Status Proposal */}
          <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F3FF]">
                <FiTarget size={18} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2340]">Status Proposal</p>
                <p className="text-[11px] text-[#94A3B8]">Distribusi proposal berdasarkan status</p>
              </div>
            </div>
            <DonutChart
              data={{
                approved: approved_applications,
                pending: pending_applications,
                rejected: rejected_applications,
              }}
            />
          </div>
        </section>

        {/* ─── Kategori + Lokasi Tenant ─────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Kategori Tenant */}
          <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7ED]">
                <LuSparkles size={18} className="text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2340]">Kategori Tenant</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {dominant_category
                    ? `${dominant_category} paling dominan`
                    : "Distribusi kategori tenant"}
                </p>
              </div>
            </div>

            {category_counts && Object.keys(category_counts).length > 0 ? (
              <CategoryBars categories={category_counts} />
            ) : (
              <div className="flex min-h-[80px] items-center justify-center">
                <p className="text-sm text-[#94A3B8]">Belum ada data kategori.</p>
              </div>
            )}
          </div>

          {/* Lokasi Tenant */}
          <div className="overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F3FF]">
                <FiBarChart2 size={18} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2340]">Lokasi Tenant</p>
                <p className="text-[11px] text-[#94A3B8]">
                  {has_location_data ? "Distribusi lokasi UMKM" : "Data lokasi belum tersedia"}
                </p>
              </div>
            </div>

            {has_location_data && location_counts && Object.keys(location_counts).length > 0 ? (
              <CategoryBars categories={location_counts} />
            ) : (
              <div className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAF9]">
                <p className="text-sm font-medium text-[#94A3B8]">Data lokasi belum tersedia</p>
                <p className="text-xs text-[#CBD5E1]">Lokasi UMKM akan muncul jika terisi di profil masing-masing.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── Insight Event ────────────────────────────────── */}
        {insights && insights.length > 0 && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-[#E6ECF3] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7ED]">
                <LuSparkles size={18} className="text-[#FF8A00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2340]">Insight Event</p>
                <p className="text-[11px] text-[#94A3B8]">Rangkuman performa event berdasarkan data</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {insights.map((insight, i) => (
                <InsightItem key={i} insight={insight} />
              ))}
            </div>
          </section>
        )}

        {/* ─── Quick actions ────────────────────────────────── */}
        <section className="flex flex-wrap items-center gap-3">
          <Link
            to={`/school/events/${eventId}/tenants`}
            className="inline-flex items-center gap-2 rounded-full bg-[#1677C8] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1268B2]"
          >
            <LuStore size={14} />
            Kelola Tenant
          </Link>
          <Link
            to={`/school/applications?event=${eventId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B2340] transition hover:border-[#1677C8] hover:text-[#1677C8]"
          >
            <LuMegaphone size={14} />
            Lihat Lamaran
          </Link>
          <Link
            to={`/school/ai-match?event=${eventId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B2340] transition hover:border-[#FF8A00] hover:text-[#FF8A00]"
          >
            <LuSparkles size={14} className="text-[#FF8A00]" />
            AI Match
          </Link>
        </section>
      </main>
    </div>
  );
}
