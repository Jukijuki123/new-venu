import { Bot, LineChart, Search } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
    {
        icon: Search,
        title: "Cari Event",
        description:
            "Fitur ini membantu Anda menemukan event dan UMKM yang sesuai dengan kebutuhan Anda.",
    },
    {
        icon: Bot,
        title: "Sinkron AI",
        description:
            "Fitur ini membantu mencocokkan event sekolah dengan UMKM yang sesuai berdasarkan kebutuhan masing-masing.",
    },
    {
        icon: LineChart,
        title: "Analisis Otomatis",
        description:
            "Fitur ini membantu Anda menganalisis performa event secara otomatis dan lebih akurat.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">

            <p className="text-sm font-bold tracking-wide text-navy">
                <span className="text-accent">{"<"}</span>
                VENU
                <span className="text-accent">{">"}</span>
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
                Yang Bisa Kamu Dapatkan.
            </h2>
            <span className="mt-3 block h-1.5 w-40 rounded-full bg-accent" />

            <div className="mt-10 lg:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
                {FEATURES.map((feature) => (
                    <article
                        key={feature.title}
                        className="flex flex-col rounded-2xl bg-navy p-6 text-white group transition-all duration-300 ease-in-out hover:scale-105"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy">
                            <feature.icon size={24} />
                        </span>

                        <h3 className="mt-4 text-lg font-bold leading-snug">
                            {feature.title}
                        </h3>

                        <p className="mt-2 flex-1 text-sm text-white/70">
                            {feature.description}
                        </p>

                        <Link
                            to="/login"
                            className="mt-4 self-end text-sm font-semibold text-accent hover:text-accent-light"
                        >
                            Cek Detail &gt;
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}