import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SchoolCtaBanner() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/school/ai-match");
    };

    return (
        <section className="relative overflow-hidden">
            {/* Background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/bg_cta_banner.png')" }}
            />

            {/* Overlay tambahan */}
            <div aria-hidden="true" className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[140px] max-w-7xl items-center justify-center px-6 py-10 md:min-h-[200px] md:px-8">
                <div className="flex flex-col items-center text-center">
                    <h2 className="max-w-4xl text-lg font-semibold leading-tight text-white md:text-3xl lg:text-[30px]">
                        Temukan UMKM yang sesuai untuk eventmu.
                        <br />
                        Bangun kolaborasi bersama.
                    </h2>

                    <button
                        type="button"
                        onClick={handleClick}
                        className="group mt-6 inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-accent px-6 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105 hover:shadow-md active:translate-y-0 md:text-base"
                    >
                        Cari UMKM
                        <ChevronRight
                            size={16}
                            strokeWidth={2.5}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}