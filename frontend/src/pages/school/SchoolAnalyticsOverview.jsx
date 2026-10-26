import { Link } from "react-router-dom";
import SchoolNavbar from "../../components/layout/SchoolNavbar";
import { useMyEvents } from "../../features/event-management/useMyEvents";

export default function SchoolAnalyticsOverview() {
    const { events, isLoading } = useMyEvents();
    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface">
                <SchoolNavbar />
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy/10 border-t-navy" />
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-surface">
            <SchoolNavbar />
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                <h1 className="text-2xl font-extrabold text-navy">Analisis Event</h1>
                <p className="mt-1 text-sm text-navy/60">Pilih event untuk melihat analisis performa & insight tenant.</p>
                {events.length === 0 ? (
                    <p className="mt-8 rounded-xl border border-dashed border-navy/10 bg-white p-8 text-center text-sm text-navy/50">Belum ada event.</p>
                ) : (
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                        {events.map((ev) => (
                            <Link key={ev.id} to={`/school/events/${ev.id}/analytics`} className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="font-semibold text-navy">{ev.name}</p>
                                <p className="text-xs text-navy/50">{ev.location} · {ev.status}</p>
                                <span className="mt-3 inline-flex text-xs font-semibold text-accent">Lihat Analisis →</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
