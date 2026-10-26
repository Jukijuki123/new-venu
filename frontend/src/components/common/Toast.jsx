import { Info, X } from "lucide-react";


export default function Toast({ show, message, onClose }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4 transition-all duration-300 ease-out ${show
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
                }`}
        >
            <div className="flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-navy/10">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Info size={18} />
                </span>

                <p className="flex-1 text-sm leading-relaxed text-navy/80">{message}</p>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup notifikasi"
                    className="mt-0.5 shrink-0 text-navy/40 transition hover:text-navy"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}