import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function AiAssistantIntro({
    description = "Disini aku akan membantu kamu menyinkronkan usaha kamu dengan event yang sedang berlangsung.",
    buttonText = "Ayo sinkronkan",
    targetPath = "/umkm/ai-match",
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(targetPath);
    };

    return (
        <section className="relative overflow-hidden bg-white py-8 md:py-25">
            <div
                aria-hidden="true"
                className="absolute -right-20 top-0 hidden h-full w-[42%] bg-blue-200 md:block"
                style={{
                    clipPath: "ellipse(65% 75% at 80% 50%)",
                }}
            />

            <div className="relative mx-auto flex max-w-6xl flex-col px-5 py-10 sm:px-6 md:min-h-[390px] md:flex-row md:items-center md:px-10 md:py-14">
                <div className="relative z-10 order-2 w-full md:order-1 md:w-[58%]">
                    <h2 className="text-3xl font-extrabold leading-tight text-navy md:text-4xl">
                        Halo aku VEN
                        <span className="ml-1 inline-block text-accent">⌁</span>
                    </h2>

                    <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-navy/80 md:text-lg">
                        {description}
                    </p>

                    <div className="mt-8">
                        <Button
                            type="button"
                            onClick={handleClick}
                            variant="primary"
                            className="rounded-full px-5 py-2 font-bold sm:px-8"
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>

                <div
                    className="relative order-1 mx-auto h-[260px] w-full sm:h-[300px] md:absolute md:bottom-0 md:right-0 md:order-2 md:mx-0 md:h-[360px] md:w-[43%]"
                    aria-label="VEN AI Assistant"
                >
                    <div className="absolute left-[8%] top-3 z-20 w-[145px] rounded-md bg-white px-3 py-2 text-[10px] font-semibold leading-tight text-navy shadow-[0_2px_6px_rgba(0,0,0,0.18)] sm:left-[12%] md:left-0 md:top-5">
                        Aku akan membantu
                        <br />
                        kamu mencari event
                        <br />
                        yang cocok

                        <span
                            aria-hidden="true"
                            className="absolute -right-[18px] bottom-[10px] h-0 w-0 border-y-[9px] border-l-[18px] border-y-transparent border-l-white"
                        />

                        <span
                            aria-hidden="true"
                            className="absolute -right-[23px] bottom-[6px] h-[14px] w-[8px] rotate-[-28deg] rounded-full bg-white"
                        />
                    </div>

                    <img
                        src="/venBot_image.png"
                        alt="VEN AI Assistant"
                        className="absolute bottom-0 right-[8%] z-10 h-[280px] w-auto object-contain sm:right-[12%] sm:h-[320px] md:right-6 md:h-[420px]"
                    />
                </div>
            </div>
        </section>
    );
}