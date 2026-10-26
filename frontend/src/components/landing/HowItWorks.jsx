const STEPS = [
  "Buat akun sekolah atau usahamu.",
  "Daftarkan usahamu sebagai tenant atau kirim proposal sekolah untuk bekerja sama.",
  "Menunggu proses konfirmasi dari pihak terkait.",
  "Setelah terkonfirmasi, Anda dapat bergabung menjadi bagian dari event.",
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Kolom kirii: gambar */}
        <div className="relative mx-auto h-[420px] w-full max-w-md">

          <div className="absolute right-0 top-0 h-64 w-[85%] overflow-hidden rounded-2xl border-4 border-navy shadow-lg">
            <img
              src="/carakerja1.png"
              alt="Suasana tenant UMKM di event sekolah"
              className="h-full w-full object-cover"
            />
          </div>


          <div className="absolute bottom-0 left-0 h-64 w-[65%] overflow-hidden rounded-b-2xl rounded-tr-2xl rounded-tl-[4rem] border-4 border-navy shadow-lg">
            <img
              src="/carakerja2.png"
              alt="Pengunjung berbelanja di booth UMKM"
              className="h-full w-full object-cover"
            />
          </div>


          <div className="absolute bottom-0 right-0 flex w-[30%] flex-col gap-3">
            <span className="h-8 rounded-full bg-navy" />
            <span className="h-8 rounded-full bg-navy" />
            <span className="h-8 rounded-full bg-navy" />
          </div>
        </div>

        {/* Kolom kanan: judul + timeline step */}
        <div>
          <h2 className="text-3xl font-extrabold text-navy md:text-4xl">
            Cara Kerja
          </h2>
          <span className="mt-3 block h-1.5 w-32 rounded-full bg-accent" />

          <ol className="relative mt-8 space-y-8 pl-2">

            <span
              aria-hidden="true"
              className="absolute bottom-2 left-[17px] top-2 w-0.5 bg-navy/15"
            />

            {STEPS.map((step, i) => (
              <li key={i} className="group relative flex gap-5">
                <span className="relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full bg-navy transition-colors duration-200 group-hover:bg-accent" />
                <p className="cursor-default font-semibold text-navy/80 transition-colors duration-200 group-hover:text-accent">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}