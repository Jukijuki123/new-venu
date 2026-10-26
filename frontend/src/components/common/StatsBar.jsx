import { useEffect, useRef, useState } from "react";

const STATS = [
    {
        value: 50,
        suffix: "+",
        label: "Sekolah bergabung",
    },
    {
        value: 100,
        suffix: "+",
        label: "UMKM bergabung",
    },
    {
        value: 90,
        suffix: "%",
        label: "Kepuasan pengguna",
    },
    {
        value: 100,
        suffix: "%",
        label: "Event Terlaksana",
    },
];

function AnimatedNumber({ value, suffix, start }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) {
            setCount(0);
            return;
        }

        let animationFrame;
        const duration = 1600;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out supaya animasi cepat di awal lalu melambat
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easedProgress * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [value, start]);

    return (
        <span>
            {count}
            {suffix}
        </span>
    );
}

export default function StatsBar() {
    const sectionRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const element = sectionRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-20 mx-auto -mt-8 -mb-10 w-full max-w-6xl px-4 md:-mt-10 md:px-8"
        >
            <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg md:grid-cols-4">
                {STATS.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={[
                            "group flex min-h-[76px] flex-col items-center justify-center px-3 py-3 text-center",
                            "transition-all duration-300 ease-out",
                            "hover:-translate-y-1 hover:bg-surface-muted/40",
                            index % 2 !== 0
                                ? "border-l border-navy/10"
                                : "",
                            index >= 2
                                ? "border-t border-navy/10 md:border-t-0"
                                : "",
                            index === 2
                                ? "md:border-l border-navy/10"
                                : "",
                        ].join(" ")}
                    >
                        <div className="text-2xl font-semibold leading-none text-black transition-transform duration-300 group-hover:scale-105 md:text-3xl">
                            <AnimatedNumber
                                value={stat.value}
                                suffix={stat.suffix}
                                start={hasStarted}
                            />
                        </div>

                        <p className="mt-1.5 text-[9px] font-medium text-navy/70 transition-colors duration-300 group-hover:text-navy md:text-[10px]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}