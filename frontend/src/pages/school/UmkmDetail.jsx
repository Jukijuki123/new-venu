import {
    FaStar,
    FaUsers,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaArrowLeft,
} from "react-icons/fa";

import { Link, useParams } from "react-router-dom";

import SchoolNavbar from "../../components/layout/SchoolNavbar";
import Footer from "../../components/layout/Footer";

import { UMKMS } from "../../data/umkms";

export default function UmkmDetail() {
    const { slug } = useParams();

    const umkm = UMKMS.find(
        (item) => item.slug === slug
    );

    if (!umkm) {
        return (
            <div className="min-h-screen bg-[#F7F8FA]">
                <SchoolNavbar />

                <main className="mx-auto max-w-6xl px-4 py-20 md:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-navy">
                            UMKM tidak ditemukan
                        </h1>

                        <Link
                            to="/school"
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
            <SchoolNavbar />

            <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">

                {/* Back */}
                <Link
                    to="/school"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-navy/70 transition hover:text-accent"
                >
                    <FaArrowLeft />
                    Kembali
                </Link>

                {/* Main Card */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                    {/* Image */}
                    <div className="h-[280px] w-full bg-gray-100 md:h-[420px]">
                        <img
                            src={umkm.image}
                            alt={umkm.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Information */}
                    <div className="p-6 md:p-10">

                        {/* Name */}
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-black md:text-4xl">
                                {umkm.name}
                            </h1>

                            <FaCheckCircle className="shrink-0 text-xl text-[#1683E8]" />
                        </div>

                        {/* Category */}
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {umkm.category}

                            <span className="mx-2 text-gray-400">
                                •
                            </span>

                            {umkm.type}

                            <span className="mx-2 text-gray-400">
                                •
                            </span>

                            {umkm.service}
                        </p>

                        {/* Rating / Collaboration */}
                        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <FaStar className="text-lg text-[#FFC400]" />

                                <span className="font-semibold">
                                    {umkm.rating}
                                </span>

                                <span className="text-sm text-gray-400">
                                    ({umkm.reviews} ulasan)
                                </span>
                            </div>

                            {/* Collaboration */}
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-[#1683E8]" />

                                <span className="font-semibold">
                                    {umkm.collaboration}
                                </span>

                                <span className="text-sm text-gray-500">
                                    Kolaborasi
                                </span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mt-6 flex items-center gap-2">
                            <FaMapMarkerAlt className="shrink-0 text-[#1683E8]" />

                            <span className="font-medium text-gray-700">
                                {umkm.location}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-100" />

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-bold text-navy md:text-xl">
                                Tentang UMKM
                            </h2>

                            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                                {umkm.description}
                            </p>
                        </div>

                        {/* Products */}
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-navy md:text-xl">
                                Produk
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {umkm.products.map((product) => (
                                    <span
                                        key={product}
                                        className="rounded-full bg-navy/5 px-4 py-2 text-xs font-semibold text-navy"
                                    >
                                        {product}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}