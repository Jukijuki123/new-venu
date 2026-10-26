import { ChevronRight, ShieldCheck } from "lucide-react";
import Button from "../common/Button";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-10 sm:px-6 sm:py-14 md:grid md:grid-cols-2 md:items-center md:gap-8 md:px-8 md:py-20 lg:gap-12 lg:py-24">
        <div
          className="relative order-1 flex w-full justify-center md:order-2"
          aria-hidden="true"
        >
          <div className="relative h-[330px] w-[300px] sm:h-[370px] sm:w-[340px] md:h-[390px] md:w-[350px] lg:h-[500px] lg:w-[450px]">
            <img
              src="/umkm_img1.png"
              alt="Suasana event UMKM di sekolah"
              className="absolute left-1/2 top-5 h-[180px] w-full -translate-x-1/2 rounded-xl border-2 md:border-4 border-navy object-cover shadow-lg sm:top-6 sm:h-[230px] sm:rounded-2xl md:h-[240px] lg:top-8 lg:h-[315px]"
            />

            <div className="absolute left-1/2 top-2 z-10 -translate-x-[calc(50%+90px)] sm:top-3 sm:-translate-x-[calc(50%+105px)] lg:top-5 lg:-translate-x-[calc(50%+140px)]">
              <span className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-md sm:text-sm">
                <ShieldCheck size={14} className="text-accent sm:h-4 sm:w-4" />
                Terpercaya
              </span>
            </div>

            <div className="absolute bottom-[18px] left-[7%] h-[125px] w-[40%] overflow-hidden rounded-xl border-2 md:border-4 border-accent bg-white shadow-lg sm:bottom-[20px] sm:h-[140px] md:h-[125px] lg:bottom-[24px] lg:h-[165px] lg:rounded-2xl">
              <img
                src="/umkm_img2.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute bottom-[18px] right-[7%] h-[125px] w-[40%] overflow-hidden rounded-xl border-2 md:border-4 border-accent bg-white shadow-lg sm:bottom-[20px] sm:h-[140px] md:h-[125px] lg:bottom-[24px] lg:h-[165px] lg:rounded-2xl">
              <img
                src="/umkm_img3.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="order-2 mt-8 w-full md:order-1 md:mt-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Hubungkan Usahamu
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-navy md:text-4xl lg:text-5xl">
            Temukan Ruang
            <br />
            <span className="text-accent">Kembangkan Usaha</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-navy/60 md:text-lg">
            Platform digital yang mempertemukan sekolah, UMKM, dan
            pengunjung dalam menciptakan peluang usaha serta menghidupkan
            potensi bisnis lokal di lingkungan sekolah.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              as="a"
              href="/events"
              variant="primary"
              className="w-full justify-center sm:w-auto"
            >
              Temukan Event
              <ChevronRight size={18} />
            </Button>

            <Button
              as="a"
              href="/register"
              variant="outline"
              className="w-full justify-center sm:w-auto"
            >
              Daftarkan Usahamu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}