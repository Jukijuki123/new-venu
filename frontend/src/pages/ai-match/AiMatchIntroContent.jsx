import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

const AiMatchIntroContent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-[#0B294D]">
      <main className="relative">

        <div className="pointer-events-none absolute left-[-120px] top-[85px] h-[300px] w-[300px] rounded-full bg-[#DCEBFF]" />
        <div className="pointer-events-none absolute right-[-80px] top-[150px] h-[250px] w-[250px] rounded-full bg-[#EFF7FF]" />

        <div className="pointer-events-none absolute right-[-10px] top-[100px] hidden h-[100px] w-[230px] opacity-70 lg:block">
          <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(#C9DDF5_1.5px,transparent_1.5px)] [background-size:8px_8px]" />
        </div>

        <svg
          className="pointer-events-none absolute right-[-20px] top-[170px] hidden h-[180px] w-[350px] lg:block"
          viewBox="0 0 350 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 150C100 40 170 40 235 75C280 100 310 100 350 70" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>

        <div className="relative mx-auto max-w-[1100px] px-6 pb-12 pt-14">
          <section className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <LuSparkles size={25} strokeWidth={1.8} className="text-[#1677FF]" />
              <h1 className="text-[44px] font-bold tracking-[-2px] sm:text-[52px]">
                <span className="text-[#FEA232]">AI</span>{" "}
                <span className="text-[#001F3F]">Match</span>
              </h1>
              <LuSparkles size={25} strokeWidth={1.8} className="text-[#1677FF]" />
            </div>

            <p className="mx-auto max-w-[600px] text-[16px] leading-7 text-[#244568]">
              Temukan event yang paling cocok untuk UMKM-mu
              <br className="hidden sm:block" />
              atau UMKM yang sesuai dengan kebutuhan sekolah.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 md:gap-7">
            {/* Card UMKM -> Event */}
            <div className="group rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(11,41,77,0.05)]">
              <div className="relative min-h-full overflow-hidden rounded-[14px] border border-[#FFB8B8] bg-[#FFF0F0] px-5 py-6 sm:px-6 sm:py-7 lg:px-8">
                <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-white/40" />

                <div className="relative z-10 flex h-full flex-col gap-6 sm:grid sm:grid-cols-[130px_1fr] sm:items-center sm:gap-5 lg:grid-cols-[155px_1fr]">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center sm:mb-6 sm:h-16 sm:w-16">
                      <img
                        src="/img/logoumkm.png"
                        alt="Logo UMKM"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <img
                      src="/img/UMKM.png"
                      alt="Ilustrasi UMKM"
                      className="h-[150px] w-auto object-contain sm:h-[135px] lg:h-[150px]"
                    />
                  </div>

                  <div className="w-full">
                    <h2 className="mb-2 text-center text-[22px] font-bold tracking-[-0.8px] sm:text-left sm:text-[23px] lg:text-[24px]">
                      <span className="text-[#AF0100]">UMKM</span>{" "}
                      <span className="font-medium text-[#AF0100]">→</span>{" "}
                      <span className="text-[#0B294D]">Event</span>
                    </h2>

                    <p className="mb-5 text-center text-[13px] leading-5 text-[#244568] sm:max-w-[280px] sm:text-left sm:text-[12px]">
                      Dapatkan rekomendasi event yang paling cocok untuk bisnismu.
                    </p>

                    <div className="space-y-2.5">
                      {[
                        "Cocok berdasarkan produk & kategori",
                        "Target pengunjung yang sesuai",
                        "Lokasi strategis",
                        "Budget yang pas",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-[12px] leading-5 text-[#244568] sm:text-[11px]"
                        >
                          <FiCheckCircle
                            size={14}
                            className="mt-0.5 shrink-0 text-[#AF0100]"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/umkm/ai-match/hasil")}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9141A] px-4 py-3 text-[12px] font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#A90F14] sm:w-auto sm:py-2.5 sm:text-[11px]"
                    >
                      Temukan Event untuk Usahamu
                      <FiArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Sekolah -> UMKM */}
            <div className="group rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(11,41,77,0.05)]">
              <div className="relative min-h-full overflow-hidden rounded-[14px] border border-[#8BC4FF] bg-[#EEF8FF] px-5 py-6 sm:px-6 sm:py-7 lg:px-8">
                <div className="absolute -bottom-24 -right-20 h-52 w-52 rounded-full bg-white/50" />

                <div className="relative z-10 flex h-full flex-col gap-6 sm:grid sm:grid-cols-[130px_1fr] sm:items-center sm:gap-5 lg:grid-cols-[155px_1fr]">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center sm:mb-6 sm:h-16 sm:w-16">
                      <img
                        src="/img/logosekolah.png"
                        alt="Logo Sekolah"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <img
                      src="/img/Sekolah.png"
                      alt="Ilustrasi Sekolah"
                      className="h-[150px] w-auto object-contain sm:h-[135px] lg:h-[150px]"
                    />
                  </div>

                  <div className="w-full">
                    <h2 className="mb-2 text-center text-[22px] font-bold tracking-[-0.8px] sm:text-left sm:text-[23px] lg:text-[24px]">
                      <span className="text-[#2575B8]">Sekolah</span>{" "}
                      <span className="font-medium text-[#2575B8]">→</span>{" "}
                      <span className="text-[#001F3F]">UMKM</span>
                    </h2>

                    <p className="mb-5 text-center text-[13px] leading-5 text-[#244568] sm:max-w-[280px] sm:text-left sm:text-[12px]">
                      Temukan UMKM yang sesuai dengan kebutuhan event sekolahmu.
                    </p>

                    <div className="space-y-2.5">
                      {[
                        "Rekomendasi UMKM terbaik",
                        "Sesuai kategori kebutuhan",
                        "Lihat profil & portofolio",
                        "Mudah ajukan kerja sama",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-[12px] leading-5 text-[#244568] sm:text-[11px]"
                        >
                          <FiCheckCircle
                            size={14}
                            className="mt-0.5 shrink-0 text-[#1677FF]"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/school/ai-match/hasil")}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2575B8] px-4 py-3 text-[12px] font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#1A5A9E] sm:w-auto sm:py-2.5 sm:text-[11px]"
                    >
                      Temukan UMKM untuk Eventmu
                      <FiArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[18px] border border-[#D6E8F9] bg-[#EFF8FF] px-7 py-6 sm:px-9">
            <h2 className="mb-6 text-[21px] font-bold tracking-[-0.5px]">
              Mengapa AI Match <span className="text-[#F59E0B]">VENU</span>?
            </h2>

            <div className="grid gap-7 md:grid-cols-3">
              <div className="flex gap-4">
                <img className="w-13 h-13" src="/img/Akurat.png" alt="" />
                <div>
                  <h3 className="mb-1 text-[15px] font-bold text-[#1677FF]">Akurat & Relevan</h3>
                  <p className="text-[10px] leading-4 text-[#244568]">
                    AI kami menganalisis data untuk memberikan rekomendasi paling cocok untukmu.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <img className="w-13 h-13" src="/img/Hemat.png" alt="" />
                <div>
                  <h3 className="mb-1 text-[15px] font-bold text-[#1677FF]">Hemat Waktu</h3>
                  <p className="text-[10px] leading-4 text-[#244568]">
                    Temukan peluang terbaik atau partner tepat tanpa perlu mencari satu per satu.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <img className="w-13 h-13" src="/img/Aman.png" alt="" />
                <div>
                  <h3 className="mb-1 text-[15px] font-bold text-[#1677FF]">Aman & Terpercaya</h3>
                  <p className="text-[10px] leading-4 text-[#244568]">
                    Semua data dan proses dijaga dengan sistem keamanan berstandar tinggi.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[#DDECF9] bg-[#F3F9FF] px-4 py-2 text-[10px] text-[#244568] shadow-sm">
              <FiShield size={13} className="text-[#1677FF]" />
              <span>Didukung AI pintar untuk hasil yang lebih relevan dan akurat.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiMatchIntroContent;