import { Bot, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const MARQUEE_ITEMS = [
    { text: "Mitra terpercaya", icon: ShieldCheck },
    { text: "Proses mudah", icon: Zap },
    { text: "Peluang lebih luas", icon: TrendingUp },
    { text: "Dukungan cerdas", icon: Bot },
];

export default function MarqueeBanner() {
    return (
        <div className="relative my-16">
            {/* Strip navy */}
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 z-0 h-16 w-[120%] -translate-x-1/2 -translate-y-1/2 -rotate-3 bg-navy md:h-16"
            />

            {/* Bar marquee kuning */}
            <div className="relative z-10 overflow-hidden bg-accent py-4">
                <div className="flex w-max animate-marquee">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <span
                                key={`${item.text}-${i}`}
                                className="flex shrink-0 items-center gap-2 whitespace-nowrap px-6 text-lg font-extrabold text-navy"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy text-white">
                                    <Icon size={16} />
                                </span>
                                {item.text}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}