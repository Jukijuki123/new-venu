export default function AiAssistantIntro({ onSyncClick }) {
  return (
    <section className="relative overflow-hidden bg-sky-50/60">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="section-title">
            Halo aku <span className="text-accent">VEN</span>
          </h2>
          <p className="mt-4 max-w-md text-navy/70">
            Disini aku akan membantu kamu menyinkronkan usaha kamu dengan
            event yang sedang berlangsung.
          </p>
          <button onClick={onSyncClick} className="btn-navy mt-6">
            Ayo sinkronkan
          </button>
        </div>

        <div className="relative flex justify-center">
          {/* Speech bubble */}
          <div className="absolute -top-2 left-1/2 w-56 -translate-x-1/4 rounded-xl bg-white p-3 text-sm text-navy/80 shadow-md md:left-8 md:translate-x-0">
            Aku akan membantu kamu mencari event yang cocok
          </div>

          <img
            src="/assets/mascot-ven.png"
            alt="Maskot AI VEN"
            className="mt-16 w-64 md:w-80"
          />
        </div>
      </div>
    </section>
  );
}
