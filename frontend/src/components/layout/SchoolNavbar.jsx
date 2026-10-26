import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { FiLogOut } from "react-icons/fi";

const NAV_ITEMS = [
    { label: "Beranda", to: "/school" },
    { label: "Event Saya", to: "/school/events" },
    { label: "Lamaran Masuk", to: "/school/applications" },
    { label: "AI Match", to: "/school/ai-match" },
    { label: "Profile", to: "/school/profile" },
];

export default function SchoolNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-18 md:px-8">
                <Link
                    to="/school"
                    className="flex shrink-0 items-center text-xl font-extrabold tracking-tight text-navy"
                    aria-label="VENU Beranda"
                >
                    <img src="/logo-venu.svg" alt="Logo Venu" className="h-8" />
                    <span className="ml-1">VENU</span>
                </Link>

                <ul className="hidden items-center gap-8 text-sm font-medium text-navy/80 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.to === "/school"}
                                className={({ isActive }) =>
                                    [
                                        "relative py-1 transition-colors",
                                        isActive
                                            ? "font-semibold text-navy after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                                            : "hover:text-navy",
                                    ].join(" ")
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-5 md:flex">
                    <button
                        type="button"
                        aria-label="Notifikasi"
                        className="text-navy/70 transition-colors hover:text-navy"
                    >
                        <Bell size={18} strokeWidth={1.8} />
                    </button>

                    <div className="text-left leading-tight">
                        <p className="text-xs font-semibold text-navy">
                            {user?.name || "Pengguna"}
                        </p>
                        <p className="text-[9px] text-navy/45">Pihak Sekolah</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Keluar dari akun"
                        title="Keluar"
                        className="rounded-lg p-2 text-navy/60 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                        <FiLogOut size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
                    aria-expanded={isMenuOpen}
                    className="rounded-lg p-2 text-navy transition-colors hover:bg-navy/5 md:hidden"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {isMenuOpen && (
                <div className="absolute left-0 right-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-navy/10 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden">
                    <ul className="flex flex-col">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.to === "/school"}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        [
                                            "block rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
                                            isActive
                                                ? "bg-accent/10 text-accent"
                                                : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                                        ].join(" ")
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-2 flex items-center justify-between border-t border-navy/10 px-3 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="leading-tight">
                                <p className="text-sm font-semibold text-navy">
                                    {user?.name || "Pengguna"}
                                </p>
                                <p className="text-[10px] text-navy/45">Pihak Sekolah</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Notifikasi"
                                className="text-navy/70 transition-colors hover:text-navy"
                            >
                                <Bell size={19} strokeWidth={1.8} />
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="Keluar dari akun"
                                title="Keluar"
                                className="rounded-lg p-2 text-navy/60 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}