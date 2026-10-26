import {
    FaBuilding,
    FaCalendarAlt,
    FaStore,
    FaChevronRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { EVENTS } from "../../data/events";

export default function NearbyEvents() {
    return (
        <section
            id="nearby-events"
            className="bg-[#F7F8FA] px-4 py-14 md:px-8 md:py-16"
        >
            <div className="mx-auto max-w-6xl">

                {/* Title */}
                <h2 className="text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
                    Event Terdekat
                </h2>

                {/* Cards */}
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {EVENTS.map((event) => (
                        <div
                            key={event.slug}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="h-[150px] w-full overflow-hidden bg-gray-200">
                                <img
                                    src={event.image}
                                    alt={event.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4">

                                {/* Name */}
                                <h3 className="text-[20px] font-bold leading-tight text-black">
                                    {event.name}
                                </h3>

                                {/* Category */}
                                <p className="mt-2 text-[14px] font-medium text-gray-700">
                                    {event.category}
                                </p>

                                {/* School */}
                                <div className="mt-6 flex items-center gap-1.5">
                                    <FaBuilding className="text-[15px] text-[#1683E8]" />

                                    <span className="text-[14px] font-medium text-gray-700">
                                        {event.school}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="mt-4 flex items-center gap-1.5">
                                    <FaCalendarAlt className="text-[15px] text-[#1683E8]" />

                                    <span className="text-[14px] font-medium text-gray-700">
                                        {event.date}
                                    </span>
                                </div>

                                {/* Tenant */}
                                <div className="mt-4 flex items-center gap-1.5">
                                    <FaStore className="text-[15px] text-[#1683E8]" />

                                    <span className="text-[14px] font-medium text-gray-700">
                                        {event.tenant}
                                    </span>
                                </div>

                                {/* Detail */}
                                <div className="mt-5 flex justify-end">
                                    <Link
                                        to={`/umkm/events/${event.slug}`}
                                        className="flex items-center gap-1 text-[13px] font-bold text-black transition-colors hover:text-[#1683E8]"
                                    >
                                        Lihat Detail

                                        <FaChevronRight className="text-[10px]" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}