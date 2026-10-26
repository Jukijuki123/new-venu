import {
    FaArrowLeft,
    FaBuilding,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaStore,
} from "react-icons/fa";

import { Link, useParams } from "react-router-dom";

import UmkmNavbar from "../../components/layout/UmkmNavbar";
import Footer from "../../components/layout/Footer";

import { EVENTS } from "../../data/events";

export default function EventDetail() {
    const { slug } = useParams();

    const event = EVENTS.find(
        (item) => item.slug === slug
    );

    if (!event) {
        return (
            <div className="min-h-screen bg-[#F7F8FA]">
                <UmkmNavbar />

                <main className="mx-auto max-w-6xl px-4 py-20 md:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-navy">
                            Event tidak ditemukan
                        </h1>

                        <Link
                            to="/umkm"
                            className="mt-6 inline-block font-semibold text-accent hover:underline"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA]">
            <UmkmNavbar />

            <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">

                {/* Back */}
                <Link
                    to="/umkm"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-navy/70 transition hover:text-accent"
                >
                    <FaArrowLeft />
                    Kembali
                </Link>

                {/* Main Card */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                    {/* IMAGE */}
                    <div className="h-[280px] w-full bg-gray-100 md:h-[420px]">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* INFORMATION */}
                    <div className="p-6 md:p-10">

                        {/* Event Name */}
                        <h1 className="text-3xl font-bold text-black md:text-4xl">
                            {event.name}
                        </h1>

                        {/* Category */}
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {event.category}
                        </p>

                        {/* Information */}
                        <div className="mt-7 grid gap-5 md:grid-cols-2">

                            {/* School */}
                            <div className="flex items-center gap-3">
                                <FaBuilding className="shrink-0 text-[#ff9d2e]" />

                                <div>
                                    <p className="text-xs font-medium text-gray-400">
                                        Penyelenggara
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {event.school}
                                    </p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="shrink-0 text-[#ff9d2e]" />

                                <div>
                                    <p className="text-xs font-medium text-gray-400">
                                        Tanggal Event
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {event.date}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="shrink-0 text-[#ff9d2e]" />

                                <div>
                                    <p className="text-xs font-medium text-gray-400">
                                        Lokasi
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            {/* Tenant */}
                            <div className="flex items-center gap-3">
                                <FaStore className="shrink-0 text-[#ff9d2e]" />

                                <div>
                                    <p className="text-xs font-medium text-gray-400">
                                        Kapasitas Tenant
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {event.tenant}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-100" />

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-bold text-navy md:text-xl">
                                Tentang Event
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                                {event.description}
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}