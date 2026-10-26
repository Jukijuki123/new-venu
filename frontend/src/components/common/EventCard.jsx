import { Building2, CalendarDays, Store } from "lucide-react";
import { Link } from "react-router-dom";

function formatEventDate(date) {
    if (!date) return "-";

    const eventDate = new Date(`${date}T00:00:00`);

    return eventDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function EventCard({ event }) {
    const eventDate = formatEventDate(event.event_date);

    return (
        <article className="group overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            {/* Image sementara */}
            <div className="relative h-[135px] overflow-hidden bg-slate-200">
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                    <span className="text-xs font-semibold text-navy/40">
                        Foto Event
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="truncate text-sm font-extrabold text-navy">
                    {event.name}
                </h3>

                {/* School */}
                <div className="mt-2 flex items-center gap-1.5 text-[9px] text-navy/70">
                    <Building2
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-accent"
                    />

                    <span className="truncate">
                        {event.school?.name || "Sekolah"}
                    </span>
                </div>

                {/* Date */}
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-navy/70">
                    <CalendarDays
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-accent"
                    />

                    <span>{eventDate}</span>
                </div>

                {/* Booth */}
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-navy/70">
                    <Store
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-accent"
                    />

                    <span>{event.booth_capacity} Tenan</span>
                </div>

                {/* Detail */}
                <div className="mt-4 flex justify-end">
                    <Link
                        to={`/events/${event.slug}`}
                        className="text-[9px] font-semibold text-navy transition-colors hover:text-accent"
                    >
                        Lihat Detail ›
                    </Link>
                </div>
            </div>
        </article>
    );
}