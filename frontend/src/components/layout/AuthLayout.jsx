import { Calendar, Store, BarChart4, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Kolom Kiri: Banner Promosi & Branding (Sesuai Mockup) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy-dark p-12 text-white md:flex">
        {/* Header Branding */}
        <div>
          <Link to="/" className="text-3xl font-extrabold tracking-wider">
            <span className="text-accent">V</span>ENU
          </Link>
          <p className="mt-2 text-xs font-semibold text-accent tracking-widest uppercase">
            “Bertemu di Satu Ruang, Tumbuh Barengan.”
          </p>
        </div>

        {/* Copy Utama */}
        <div className="my-auto max-w-lg">
          <h2 className="text-4xl font-extrabold leading-tight">
            Temukan ruang,
            <br />
            buka banyak <span className="text-accent">peluang</span>.
          </h2>
          <p className="mt-4 text-sm text-white/75">
            Menghubungkan sekolah dan UMKM dalam setiap event-nya.
          </p>

          {/* Grid 3 Benefit/Fitur */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/25 text-accent">
                <Calendar size={20} />
              </div>
              <h3 className="mt-3 text-xs font-bold">Temukan Event</h3>
              <p className="mt-1 text-[10px] leading-snug text-white/60">
                Cari Event atau UMKM yang bersedia membuka tenant.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/25 text-accent">
                <Store size={20} />
              </div>
              <h3 className="mt-3 text-xs font-bold">Daftarkan Usaha</h3>
              <p className="mt-1 text-[10px] leading-snug text-white/60">
                Daftarkan usaha Anda dan jadi bagian dari event.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/25 text-accent">
                <BarChart4 size={20} />
              </div>
              <h3 className="mt-3 text-xs font-bold">Analisis Performa</h3>
              <p className="mt-1 text-[10px] leading-snug text-white/60">
                Pantau performa event dan tingkatkan peluang Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="flex items-center gap-2 text-xs text-white/80">
          <CheckCircle size={16} className="text-accent" />
          <p>Aman, terpercaya, dan mudah digunakan. Bergabunglah bersama kami dan ciptakan banyak peluang.</p>
        </div>
      </div>

      {/* Kolom Kanan: Konten Form (Login / Register / Role Selection) */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
