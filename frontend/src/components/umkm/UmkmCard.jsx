import {
    MapPin,
    Star,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UmkmCard({ umkm }) {
    return (
        <article className="group overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            {/* Logo / Foto */}
            <div className="relative h-[150px] overflow-hidden bg-slate-200">
                {umkm.logo ? (
                    <img
                        src={umkm.logo}
                        alt={umkm.business_name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                        <span className="text-xs font-semibold text-navy/40">
                            Foto UMKM
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Nama + verified */}
                <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-extrabold text-navy">
                        {umkm.business_name}
                    </h3>

                    <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-navy"
                        title="Terverifikasi"
                    >
                        ✓
                    </span>
                </div>

                {/* Category */}
                <p className="mt-1 text-[10px] text-navy/50">
                    {umkm.category}
                </p>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4 text-[10px] text-navy/65">
                    <span className="flex items-center gap-1">
                        <Star
                            size={12}
                            className="fill-accent text-accent"
                        />
                        4.9
                    </span>

                    <span className="flex items-center gap-1">
                        <Users
                            size={12}
                            className="text-accent"
                        />
                        500+
                    </span>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-start gap-1.5 text-[10px] text-navy/65">
                    <MapPin
                        size={12}
                        className="mt-0.5 shrink-0 text-accent"
                    />

                    <span className="line-clamp-2">
                        {umkm.location}
                    </span>
                </div>

                {/* Detail */}
                <div className="mt-4 flex justify-end">
                    <Link
                        to={`/umkm/${umkm.id}`}
                        className="text-[10px] font-semibold text-navy transition-colors hover:text-accent"
                    >
                        Lihat Detail ›
                    </Link>
                </div>
            </div>
        </article>
    );
}