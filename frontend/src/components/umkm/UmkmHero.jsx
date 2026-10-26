import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import TypingName from "../common/TypingName";
import { useAuth } from "../../context/useAuth";

export default function UmkmHero() {
    const { user } = useAuth();

    return (
        <section className="relative isolate overflow-hidden bg-navy">

            <div className="relative z-10 block h-[240px] w-full overflow-hidden rounded-b-[28px] md:hidden">
                <img
                    src="/imgUmkmHero.png"
                    alt=""
                    className="h-full w-full object-cover object-[15%_30%]"
                />
            </div>


            <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 z-0 hidden w-[62%] overflow-hidden md:block"
                style={{
                    clipPath: "ellipse(80% 65% at 100% 50%)",
                }}
            >
                <img
                    src="/imgUmkmHero.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[15%_30%]"
                />
            </div>


            <svg
                aria-hidden="true"
                viewBox="0 0 1000 120"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 z-0 hidden h-20 w-full fill-blue-200 md:block md:h-28"
            >
                <path d="M0,55 C160,95 300,105 430,75 C560,42 660,15 800,45 C900,65 950,85 1000,68 L1000,120 L0,120 Z" />
            </svg>


            <div
                className="
                    relative z-20 mx-auto
                    flex max-w-7xl
                    px-5 py-10
                    md:min-h-[calc(100vh-4rem)]
                    md:items-center
                    md:px-8
                    md:py-0
                "
            >
                <div className="w-full max-w-xl">
                    {/* Greeting */}
                    <div className="inline-block">
                        <p className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                            Halo,{" "}
                            <span className="font-semibold">
                                <TypingName
                                    name={user?.name || "Pengguna"}
                                />
                            </span>
                        </p>

                        <div className="mt-1 h-0.5 w-14 bg-accent" />
                    </div>

                    {/* Heading */}
                    <h1
                        className="
                            mt-5
                            text-3xl
                            font-extrabold
                            leading-tight
                            text-white
                            md:text-5xl
                        "
                    >
                        Siap berkembang bareng{" "}
                        <span className="text-accent">VENU</span>
                        <br className="hidden sm:block" />
                        <span className="text-accent"> Peluang</span> baru
                        menunggumu!
                    </h1>

                    {/* CTA */}
                    <div className="my-8 md:my-10">
                        <Button
                            as={Link}
                            to="/umkm/events"
                            variant="accent"
                            className="rounded-full px-5 py-2 text-base text-white font-semibold md:text-lg group"
                        >
                            Temukan Event
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform " />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}