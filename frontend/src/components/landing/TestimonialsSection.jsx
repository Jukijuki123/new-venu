import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";

const TESTIMONIALS = [
    {
        name: "GananRev",
        role: "Pemilik Usaha Minuman",
        rating: 5,
        quote: "Apa ini? keren sekali sangat membantu kami para UMKM.",
        avatarUrl: "/testimoni/pria.png",
    },
    {
        name: "Rayaa's",
        role: "Pemilik Usaha Aksesoris",
        rating: 5,
        quote: "Fitur pencarian event dan pendaftaran tenant benar-benar praktis sekali.",
        avatarUrl: "/testimoni/wanita.png",
    },
    {
        name: "Studio Kreatif Fahmi",
        role: "Pemilik Usaha Craft",
        rating: 5,
        quote: "Proses daftar tenant jadi jauh lebih cepat dibanding cara manual.",
        avatarUrl: "/testimoni/pria.png",
    },
    {
        name: "Derliana",
        role: "SMKN 26 Jakarta",
        rating: 5,
        quote: "VENU membantu kami menemukan UMKM yang sesuai untuk diundang ke event sekolah.",
        avatarUrl: "/testimoni/wanita.png",
    },
    {
        name: "Nur Baeti",
        role: "SMPN 90 Jakarta",
        rating: 5,
        quote: "Dengan VENU, kami lebih mudah mengajak UMKM untuk ikut meramaikan kegiatan sekolah.",
        avatarUrl: "/testimoni/wanita.png",
    },
    {
        name: "Teguh",
        role: "SMAN 21 Jakarta",
        rating: 5,
        quote: "Mencari tenant untuk event sekolah menjadi lebih mudah dan terorganisir dengan VENU.",
        avatarUrl: "/testimoni/pria.png",
    },
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const total = TESTIMONIALS.length;

    const goPrev = () => {
        setActiveIndex((i) => (i - 1 + total) % total);
    };

    const goNext = () => {
        setActiveIndex((i) => (i + 1) % total);
    };

    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    return (
        <section className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-8">
            <h2 className="text-center text-3xl font-extrabold text-navy md:text-4xl">
                Apa Kata Mereka?
            </h2>

            <div className="relative mt-8 sm:mt-10">
                <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Testimoni sebelumnya"
                    className="absolute left-1 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy p-2.5 text-white shadow-lg transition hover:bg-navy-light sm:left-0 sm:p-3"
                >
                    <ChevronLeft size={18} className="sm:h-5 sm:w-5" />
                </button>

                <button
                    type="button"
                    onClick={goNext}
                    aria-label="Testimoni berikutnya"
                    className="absolute right-1 top-1/2 z-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-navy p-2.5 text-white shadow-lg transition hover:bg-navy-light sm:right-0 sm:p-3"
                >
                    <ChevronRight size={18} className="sm:h-5 sm:w-5" />
                </button>

                <div className="overflow-hidden rounded-[2rem] bg-accent px-8 py-8 sm:rounded-[2.5rem] sm:px-10 sm:py-10 md:px-14 md:py-14">
                    <div className="flex min-w-0 items-center justify-center gap-3 md:gap-6">
                        <TestimonialCard
                            key={`prev-${prevIndex}`}
                            testimonial={TESTIMONIALS[prevIndex]}
                            variant="side"
                            className="hidden sm:block"
                        />

                        <TestimonialCard
                            key={`active-${activeIndex}`}
                            testimonial={TESTIMONIALS[activeIndex]}
                            variant="active"
                        />

                        <TestimonialCard
                            key={`next-${nextIndex}`}
                            testimonial={TESTIMONIALS[nextIndex]}
                            variant="side"
                            className="hidden sm:block"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial, variant, className = "" }) {
    const isActive = variant === "active";

    return (
        <article
            className={`shrink-0 rounded-2xl bg-white shadow-md transition-all duration-300 ${isActive
                ? "w-full max-w-[17rem] p-5 sm:max-w-xs sm:p-6 md:max-w-sm md:p-7"
                : "w-40 scale-90 p-4 opacity-90 md:w-56 md:p-5"
                } ${className}`}
        >
            <div className="flex items-center gap-3">
                {testimonial.avatarUrl ? (
                    <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className={`shrink-0 rounded-full object-cover ${isActive ? "h-11 w-11 sm:h-12 sm:w-12" : "h-9 w-9"
                            }`}
                    />
                ) : (
                    <span
                        className={`shrink-0 rounded-full bg-navy/10 ${isActive ? "h-11 w-11 sm:h-12 sm:w-12" : "h-9 w-9"
                            }`}
                    />
                )}

                <div className="min-w-0">
                    <p
                        className={`truncate font-bold text-navy ${isActive ? "text-sm sm:text-base" : "text-sm"
                            }`}
                    >
                        {testimonial.name}
                    </p>

                    <div className="mt-0.5 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={isActive ? 13 : 11}
                                className={
                                    i < testimonial.rating
                                        ? "fill-accent text-accent"
                                        : "text-navy/15"
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p
                className={`mt-2 text-navy/50 ${isActive ? "text-xs sm:text-sm" : "text-xs"
                    }`}
            >
                {testimonial.role}
            </p>

            <Quote
                size={isActive ? 20 : 16}
                className="mt-3 rotate-180 text-navy/20"
                fill="currentColor"
            />

            <p
                className={`mt-2 font-medium text-navy/80 ${isActive ? "text-sm sm:text-base" : "text-xs"
                    }`}
            >
                {testimonial.quote}
            </p>
        </article>
    );
}