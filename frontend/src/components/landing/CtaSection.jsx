import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-navy py-14 sm:py-16 md:py-24 lg:py-28">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-0 h-[400px] w-[400px] rounded-full bg-sky-500/20 blur-3xl sm:h-[500px] sm:w-[500px]"
            />

            <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-5 h-14 w-14 text-sky-400/40 sm:right-10 sm:h-16 sm:w-16 md:right-20 md:h-24 md:w-24"
                viewBox="0 0 100 100"
                fill="currentColor"
            >
                <path d="M50 0 L58 40 L100 50 L58 60 L50 100 L42 60 L0 50 L42 40 Z" />
            </svg>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-5 sm:px-6 md:grid md:grid-cols-2 md:items-center md:gap-12 md:px-8 lg:gap-16">
                <div>
                    <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                        Temukan Peluang Baru
                        <br />
                        Bersama <span className="text-accent">VENU</span>.
                    </h2>

                    <span className="mt-5 block h-1 w-24 rounded-full bg-white" />
                </div>

                <div className="relative flex justify-center py-4 md:justify-end md:py-0">
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-4 top-0 hidden h-24 w-24 text-sky-300/60 md:block lg:-left-8"
                        viewBox="0 0 120 120"
                        fill="none"
                    >
                        <defs>
                            <marker
                                id="cta-arrow-left"
                                markerWidth="8"
                                markerHeight="8"
                                refX="4"
                                refY="4"
                                orient="auto"
                            >
                                <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
                            </marker>
                        </defs>

                        <path
                            d="M10 10 C 10 70, 55 85, 105 88"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="5 5"
                            markerEnd="url(#cta-arrow-left)"
                        />
                    </svg>


                    <div className="relative w-[250px] -rotate-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-300 p-4 shadow-2xl sm:w-64 sm:p-5 md:w-80 md:p-6 lg:w-[22rem]">
                        <svg
                            aria-hidden="true"
                            className="absolute left-3 top-3 h-6 w-6 text-white/70 sm:left-4 sm:top-4 sm:h-8 sm:w-8"
                            viewBox="0 0 40 40"
                            fill="none"
                        >
                            <path
                                d="M2 2 Q2 20 20 20 Q38 20 38 38"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>

                        <p className="relative mt-8 text-sm font-bold leading-snug text-navy sm:mt-10 sm:text-base md:text-lg">
                            Saatnya Terhubung dan Berkembang Bersama Kami!
                        </p>

                        <Link
                            to="/login"
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-light sm:mt-6 sm:px-5 sm:py-2.5 sm:text-sm"
                        >
                            Mulai mencoba
                            <ArrowRight size={15} />
                        </Link>

                        <svg
                            aria-hidden="true"
                            className="absolute bottom-2 left-2 h-5 w-5 text-white/50 sm:bottom-3 sm:left-3 sm:h-6 sm:w-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2 C14 8 16 10 22 12 C16 14 14 16 12 22 C10 16 8 14 2 12 C8 10 10 8 12 2 Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}