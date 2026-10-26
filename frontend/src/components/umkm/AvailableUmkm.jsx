import {
    FaStar,
    FaUsers,
    FaMapMarkerAlt,
    FaChevronRight,
    FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { UMKMS } from "../../data/umkms";

export default function AvailableUmkm() {
    return (
        <section className="bg-[#F7F8FA] px-4 py-14 md:px-8 md:py-16">
            <div className="mx-auto max-w-6xl">
                {/* Title */}
                <h2 className="text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
                    UMKM Tersedia
                </h2>

                {/* Cards */}
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {UMKMS.map((umkm) => (
                        <div
                            key={umkm.slug}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="h-[150px] w-full overflow-hidden bg-gray-200">
                                <img
                                    src={umkm.image}
                                    alt={umkm.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Name */}
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-[20px] font-bold leading-tight text-black">
                                        {umkm.name}
                                    </h3>

                                    <FaCheckCircle className="text-[13px] text-[#1683E8]" />
                                </div>

                                {/* Category */}
                                <p className="mt-2 text-[14px] font-medium text-gray-700">
                                    {umkm.category}

                                    <span className="mx-1 text-gray-400">
                                        •
                                    </span>

                                    {umkm.type}

                                    <span className="mx-1 text-gray-400">
                                        •
                                    </span>

                                    {umkm.service}
                                </p>

                                {/* Rating & Collaboration */}
                                <div className="mt-6 flex items-center">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5">
                                        <FaStar className="text-[17px] text-[#FFC400]" />

                                        <span className="text-[14px] font-medium text-gray-800">
                                            {umkm.rating}
                                        </span>

                                        <span className="text-[12px] text-gray-400">
                                            ({umkm.reviews})
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="mx-4 h-7 w-px bg-gray-300" />

                                    {/* Collaboration */}
                                    <div className="flex items-center gap-1.5">
                                        <FaUsers className="text-[16px] text-[#1683E8]" />

                                        <div className="leading-tight">
                                            <p className="text-[14px] font-medium text-gray-800">
                                                {umkm.collaboration}
                                            </p>

                                            <p className="text-[11px] text-gray-400">
                                                Kolaborasi
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mt-5 flex items-center gap-1.5">
                                    <FaMapMarkerAlt className="text-[15px] text-[#1683E8]" />

                                    <span className="text-[14px] font-medium text-gray-700">
                                        {umkm.location}
                                    </span>
                                </div>

                                {/* Detail */}
                                <div className="mt-4 flex justify-end">
                                    <Link
                                        to={`/school/umkm/${umkm.slug}`}
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