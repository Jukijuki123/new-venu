import MarqueeBanner from "./MarqueeBanner";

export default function About() {
    return (
        <section className="relative overflow-hidden bg-white">
            <div className="mx-auto flex max-w-6xl flex-col px-5 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-16 md:grid md:grid-cols-2 md:items-center md:gap-10 md:px-8 md:pb-20 md:pt-20 lg:gap-16">
                <div className="order-2 md:order-1">
                    <div className="inline-flex items-center gap-1">
                        <h2 className="text-4xl font-extrabold text-navy sm:text-5xl">
                            VEN
                        </h2>

                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M14 2 L17 10 L25 12 L17 14 L14 22 L11 14 L3 12 L11 10 Z"
                                fill="#FEA232"
                            />
                        </svg>
                    </div>

                    <span className="mt-1 block h-1 w-16 rounded-full bg-accent" />

                    <p className="mt-6 max-w-md text-sm leading-relaxed text-navy/70 sm:text-base md:text-lg">
                        VEN merupakan bot pada website kami yang dirancang untuk
                        membantu Anda menemukan dan menyinkronkan UMKM dengan sekolah
                        yang sedang mengadakan event.
                    </p>

                </div>

                <div className="order-1 flex h-[280px] w-full justify-center md:order-2 md:h-[360px] lg:h-[460px]">
                    <img
                        src="/landing_bot.png"
                        alt="Maskot AI VEN melambaikan tangan"
                        className="h-full w-auto object-contain"
                    />
                </div>
            </div>

            <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full border-[15px] border-sky-400/70"
            />

            <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 -left-12 h-44 w-44 rounded-full border-[15px] border-sky-400/70"
            />

            <MarqueeBanner />
        </section>
    );
}